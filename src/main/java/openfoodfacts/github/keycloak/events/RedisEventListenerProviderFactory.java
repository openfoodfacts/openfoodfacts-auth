package openfoodfacts.github.keycloak.events;

import java.util.List;

import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;

public class RedisEventListenerProviderFactory implements EventListenerProviderFactory {
    private static final Logger log = Logger.getLogger(RedisEventListenerProviderFactory.class);

    private RedisClient client;

    @Override
    public EventListenerProvider create(final KeycloakSession keycloakSession) {
        return new EventListenerProvider() {

            @Override
            public void close() {
                // No-op. All processing is done in the postInit method.
            }

            @Override
            public void onEvent(Event event) {
                if (event == null) {
                    return;
                }

                final RealmModel realm = keycloakSession.realms().getRealm(event.getRealmId());
                if (realm == null) {
                    log.errorf("Failed to find realm: %s", event.getRealmId());
                    return;
                }

                final EventType eventType = event.getType();
                if (eventType == null) {
                    log.errorf("Failed to find event type: %s", event.getType());
                    return;
                }

                final boolean isUserInitialRegistrationEvent = EventType.REGISTER.equals(eventType)
                        && !realm.isVerifyEmail();
                final boolean isUserEmailVerificationEvent = EventType.VERIFY_EMAIL.equals(eventType)
                        && realm.isVerifyEmail();
                final boolean isUserRegistrationEvent = isUserInitialRegistrationEvent || isUserEmailVerificationEvent;
                if (isUserRegistrationEvent) {
                    final UserModel user = keycloakSession.users().getUserById(realm, event.getUserId());
                    RedisEventListenerProviderFactory.this.client.postUserRegistered(user, realm);
                }
            }

            @Override
            public void onEvent(AdminEvent event, boolean includeRepresentation) {
                // No-op. All processing is done in the postInit method.
            }

        };
    }

    @Override
    public void init(Config.Scope scope) {
        final String redisUrl = scope.get("redisUrl");
        this.client = new RedisClient(redisUrl);
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
