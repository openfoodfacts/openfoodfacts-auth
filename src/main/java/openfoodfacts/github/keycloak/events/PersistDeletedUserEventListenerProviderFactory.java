package openfoodfacts.github.keycloak.events;

import java.util.UUID;

import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.UserModel;
import org.keycloak.models.UserModel.UserRemovedEvent;
import openfoodfacts.github.keycloak.jpa.DeletedUserEntity;

public class PersistDeletedUserEventListenerProviderFactory implements EventListenerProviderFactory {
    private static final Logger log = Logger.getLogger(PersistDeletedUserEventListenerProviderFactory.class);

    @Override
    public EventListenerProvider create(final KeycloakSession keycloakSession) {
        return new EventListenerProvider() {

            @Override
            public void close() {
                // No-op. All processing is done in the postInit method.
            }

            @Override
            public void onEvent(Event event) {
                // No-op. All processing is done in the postInit method.
            }

            @Override
            public void onEvent(AdminEvent event, boolean includeRepresentation) {
                // No-op. All processing is done in the postInit method.
            }

        };
    }

    @Override
    public void init(Config.Scope scope) {
        // No-op. All processing is done in the postInit method.
    }

    @Override
    public void postInit(final KeycloakSessionFactory keycloakSessionFactory) {
        keycloakSessionFactory.register(
                (event) -> {
                    log.debugf("New %s Event", event.getClass().getName());

                    if (event instanceof UserModel.UserRemovedEvent userRemovedEvent) {
                        this.storeDeletedUser(userRemovedEvent);
                    }
                });
    }

    @Override
    public void close() {
        // No-op. All processing is done in the postInit method.
    }

    @Override
    public String getId() {
        return "persist-deleted-user-event-listener";
    }

    private void storeDeletedUser(final UserRemovedEvent userRemovedEvent) {
        final DeletedUserEntity entity = new DeletedUserEntity();
        final UserModel user = userRemovedEvent.getUser();
        entity.setId(UUID.randomUUID().toString());
        entity.setUserId(user.getId());
        entity.setUsername(user.getUsername());
        entity.setEmail(user.getEmail());
        userRemovedEvent.getKeycloakSession()
                .getProvider(JpaConnectionProvider.class)
                .getEntityManager()
                .persist(entity);
    }

}
