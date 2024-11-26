package openfoodfacts.github.keycloak.events;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.jboss.logging.Logger;
import org.keycloak.common.util.Time;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.UserModel.UserRemovedEvent;

import openfoodfacts.github.keycloak.jpa.DeletedUserEntity;
import openfoodfacts.github.keycloak.utils.UserAttributes;
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

        final HashMap<String, String> additionalData = new HashMap<>();

        final String newsletter = user.getFirstAttribute(UserAttributes.NEWSLETTER);
        putIfNotNull(additionalData, "newsletter", newsletter);

        final String requestedOrg = user.getFirstAttribute(UserAttributes.REQUESTED_ORG);
        putIfNotNull(additionalData, "requestedOrg", requestedOrg);

        postUserEvent("user-registered", user, realm, additionalData);
    }

    public void postUserDeleted(final UserRemovedEvent userRemovedEvent) {
        final DeletedUserEntity entity = new DeletedUserEntity();
        final UserModel user = userRemovedEvent.getUser();
        final RealmModel realm = userRemovedEvent.getRealm();

        entity.setId(UUID.randomUUID().toString());
        entity.setUserId(user.getId());
        entity.setUsername(user.getUsername());
        entity.setEmail(user.getEmail());
        entity.setCreatedTimestamp(user.getCreatedTimestamp());
        entity.setDeletedTimestamp(Time.currentTimeMillis());
        entity.generateAnonymousUsername();
        userRemovedEvent.getKeycloakSession()
                .getProvider(JpaConnectionProvider.class)
                .getEntityManager()
                .persist(entity);

        postUserEvent("user-deleted", user, realm, Map.of("newUserName", entity.getAnonymousUsername()));
    }

    private void postUserEvent(final String key, final UserModel user, final RealmModel realm,
            final Map<String, String> additionalData) {
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

        if (additionalData != null) {
            data.putAll(additionalData);
        }

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
