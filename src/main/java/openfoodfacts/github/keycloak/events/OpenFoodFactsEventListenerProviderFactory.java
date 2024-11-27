package openfoodfacts.github.keycloak.events;

import java.util.List;

import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.events.admin.OperationType;
import org.keycloak.events.admin.ResourceType;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;

import openfoodfacts.github.keycloak.jpa.DeletedUserEntity;

public class OpenFoodFactsEventListenerProviderFactory implements EventListenerProviderFactory {
    private static final Logger log = Logger.getLogger(OpenFoodFactsEventListenerProviderFactory.class);

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

                boolean isUserRegistrationEvent = isUserRegistrationEvent(event, realm);
                if (isUserRegistrationEvent) {
                    final UserModel user = keycloakSession.users().getUserById(realm, event.getUserId());
                    OpenFoodFactsEventListenerProviderFactory.this.client.postUserRegistered(user, realm);
                }
            }

            @Override
            public void onEvent(AdminEvent event, boolean includeRepresentation) {
                if (ResourceType.USER.equals(event.getResourceType()) && OperationType.CREATE.equals(event.getOperationType())) {
                    final RealmModel realm = keycloakSession.realms().getRealm(event.getRealmId());
                    if (realm == null) {
                        log.errorf("Failed to find realm: %s", event.getRealmId());
                        return;
                    }
                    final String userId = event.getResourcePath().split("/")[1];
                    final UserModel user = keycloakSession.users().getUserById(realm, userId);
                    if (user == null) {
                        log.errorf("Failed to find user: %s", userId);
                        return;
                    }
                    if (!realm.isVerifyEmail() || user.isEmailVerified()) {
                        OpenFoodFactsEventListenerProviderFactory.this.client.postUserRegistered(user, realm);
                    }
                }
            }

            private boolean isUserRegistrationEvent(final Event event, final RealmModel realm) {
                final EventType eventType = event.getType();
                if (EventType.REGISTER.equals(eventType)) {
                    if (realm.isVerifyEmail()) {
                        final UserModel user = keycloakSession.users().getUserById(realm, event.getUserId());
                        if (user == null) {
                            log.errorf("Failed to find user: %s", event.getUserId());
                            return false;
                        }

                        if (user.isEmailVerified()) {
                            // Mail address validation is enabled, but user has already validated it according to API
                            return true;
                        }
                    } else {
                        // Mail address validation is disabled
                        return true;
                    }
                } else if (EventType.VERIFY_EMAIL.equals(eventType)
                        && realm.isVerifyEmail()) {
                    return true;
                }

                return false;
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
                        final UserModel user = userRemovedEvent.getUser();
                        String anonymousUsername = DeletedUserEntity.logDeletedUser(userRemovedEvent.getKeycloakSession(), user);
                        this.client.postUserDeleted(user, userRemovedEvent.getRealm(), anonymousUsername);
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
