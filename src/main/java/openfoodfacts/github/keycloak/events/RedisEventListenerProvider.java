package openfoodfacts.github.keycloak.events;

import org.jboss.logging.Logger;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.RealmProvider;
import org.keycloak.models.UserModel;

public class RedisEventListenerProvider implements EventListenerProvider {
    private static final Logger log = Logger.getLogger(RedisEventListenerProvider.class);

    private final KeycloakSession session;
    private final RealmProvider model;
    private final Client client;

    public RedisEventListenerProvider(final KeycloakSession session, final Client client) {
        if (session == null) {
            throw new IllegalArgumentException("session");
        }

        if (client == null) {
            throw new IllegalArgumentException("client");
        }

        this.session = session;
        this.model = session.realms();
        this.client = client;
    }

    @Override
    public void onEvent(Event event) {
        log.debugf("New %s Event", event.getType());

        if (EventType.DELETE_ACCOUNT.equals(event.getType())) {
            RealmModel realm = this.model.getRealm(event.getRealmId());
            UserModel user = this.session.users().getUserById(realm, event.getUserId());
            this.client.postUserDeleted(user, realm);
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean includeRepresentation) {
    }

    @Override
    public void close() {
    }
}
