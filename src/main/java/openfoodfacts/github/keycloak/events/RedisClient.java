package openfoodfacts.github.keycloak.events;

import java.util.HashMap;
import java.util.Map;

import org.jboss.logging.Logger;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import redis.clients.jedis.JedisPooled;
import redis.clients.jedis.StreamEntryID;

public class RedisClient implements AutoCloseable {
    private static final Logger log = Logger.getLogger(RedisClient.class);

    private final JedisPooled jedis;

    public RedisClient(final String url) {
        this.jedis = new JedisPooled(url);
    }

    public void postUserRegistered(final UserModel user, final RealmModel realm) {
        if (user == null) {
            throw new IllegalArgumentException("user");
        }

        if (realm == null) {
            throw new IllegalArgumentException("realm");
        }

        postUserEvent("user-registered", user, realm);
    }

    public void postUserDeleted(final UserModel user, final RealmModel realm) {
        if (user == null) {
            throw new IllegalArgumentException("user");
        }

        if (realm == null) {
            throw new IllegalArgumentException("realm");
        }

        postUserEvent("user-deleted", user, realm);
    }

    private void postUserEvent(final String key, final UserModel user, final RealmModel realm) {
        if (key == null) {
            throw new IllegalArgumentException("key");
        }

        if (user == null) {
            throw new IllegalArgumentException("user");
        }

        if (realm == null) {
            throw new IllegalArgumentException("realm");
        }

        HashMap<String, String> data = new HashMap<>();
        putIfNotNull(data, "id", user.getId());
        putIfNotNull(data, "email", user.getEmail());
        putIfNotNull(data, "userName", user.getUsername());
        putIfNotNull(data, "realm", realm.getName());

        try {
            this.addEntriesToRedisStream(key, data);
            log.debugf("A new %s event has been forwarded to Redis", key);
        } catch (Exception e) {
            log.errorf("Failed to call API: %s", e);
        }
    }

    private void addEntriesToRedisStream(final String key, final Map<String, String> events) {
        if (key == null) {
            throw new IllegalArgumentException("key");
        }

        if (events == null) {
            throw new IllegalArgumentException("events");
        }

        jedis.xadd(key, StreamEntryID.NEW_ENTRY, events);
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
