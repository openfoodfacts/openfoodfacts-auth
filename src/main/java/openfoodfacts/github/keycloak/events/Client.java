package openfoodfacts.github.keycloak.events;

import java.util.HashMap;
import java.util.Map;

import org.jboss.logging.Logger;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import redis.clients.jedis.JedisPooled;
import redis.clients.jedis.StreamEntryID;

public class Client implements AutoCloseable {
    private static final Logger log = Logger.getLogger(Client.class);

    private final JedisPooled jedis;

    public Client(final String url) {
        this.jedis = new JedisPooled(url);
    }

    public void postUserDeleted(final UserModel user, final RealmModel realm) {
        if (user == null) {
            throw new IllegalArgumentException("user");
        }

        if (realm == null) {
            throw new IllegalArgumentException("realm");
        }

        HashMap<String, String> data = new HashMap<>();
        putIfNotNull(data, "id", user.getId());
        putIfNotNull(data, "id", user.getId());
        putIfNotNull(data, "email", user.getEmail());
        putIfNotNull(data, "userName", user.getUsername());
        putIfNotNull(data, "realm", realm.getName());

        try {
            this.postUserDeleted(data);
            log.debug("A new user deletion event has been forwarded to Redis");
        } catch (Exception e) {
            log.errorf("Failed to call API: %s", e);
        }
    }

    public void postUserDeleted(final Map<String, String> userDeletedEvents) {
        if (userDeletedEvents == null) {
            throw new IllegalArgumentException("userDeletedEvents");
        }

        jedis.xadd("user-deleted", StreamEntryID.NEW_ENTRY, userDeletedEvents);
    }

    @Override
    public void close() throws Exception {
        this.jedis.close();
    }

    private static void putIfNotNull(final HashMap<String, String> data, final String key, final String value) {
        if (value != null) {
            data.put(key, value);
        }
    }

}
