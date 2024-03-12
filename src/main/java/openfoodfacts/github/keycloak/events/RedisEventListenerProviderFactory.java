package openfoodfacts.github.keycloak.events;

import java.util.List;

import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.UserModel;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;

public class RedisEventListenerProviderFactory implements EventListenerProviderFactory {
    private static final Logger log = Logger.getLogger(RedisEventListenerProviderFactory.class);

    private Client client;

    @Override
    public EventListenerProvider create(final KeycloakSession keycloakSession) {
        return new RedisEventListenerProvider(keycloakSession, this.client);
    }

    @Override
    public void init(Config.Scope scope) {
        final String redisUrl = scope.get("redisUrl");
        this.client = new Client(redisUrl);
    }

    @Override
    public void postInit(final KeycloakSessionFactory keycloakSessionFactory) {
        keycloakSessionFactory.register(
                (event) -> {
                    log.debugf("New %s Event", event.getClass().getName());

                    if (event instanceof UserModel.UserRemovedEvent userRemovedEvent) {
                        this.client.postUserDeleted(userRemovedEvent.getUser(), userRemovedEvent.getRealm());
                    }
                });
    }

    @Override
    public void close() {
        try {
            if (client != null) {
                this.client.close();
            }
        } catch (Exception e) {
            log.errorf("Failed to close client: %s", e);
        }
    }

    @Override
    public String getId() {
        return "redis-event-listener";
    }

    @Override
    public List<ProviderConfigProperty> getConfigMetadata() {
        return ProviderConfigurationBuilder.create()
                .property()
                .name("redis-url")
                .type("string")
                .helpText("URL to the redis instance that should receive all events.")
                .add()
                .build();
    }
}
