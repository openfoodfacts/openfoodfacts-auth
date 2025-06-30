package openfoodfacts.github.keycloak.events;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledIfEnvironmentVariable;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import redis.clients.jedis.params.XReadParams;
import redis.clients.jedis.resps.StreamEntry;

import com.redis.testcontainers.*;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import redis.clients.jedis.*;

@Testcontainers
@DisabledIfEnvironmentVariable(named = "SKIP_INTEGRATION_TESTS", matches = "true")
public class CorrectProviderEventIsForwardedToRedisTest {

    @Container
    private static RedisContainer container = new RedisContainer(
            RedisContainer.DEFAULT_IMAGE_NAME.withTag(RedisContainer.DEFAULT_TAG));

    @Test
    void testCorrectProviderEventIsForwarded() {
        // Arrange
        String redisURI = container.getRedisURI();
        openfoodfacts.github.keycloak.events.OpenFoodFactsEventListenerProviderFactory factory = new openfoodfacts.github.keycloak.events.OpenFoodFactsEventListenerProviderFactory();
        factory.init(Utils.createScope(redisURI));

        KeycloakSessionFactory sessionFactory = Utils.createKeycloakSessionFactory();
        KeycloakSession session = sessionFactory.create();
        factory.postInit(sessionFactory);
        try (JedisPooled jedis = new JedisPooled(redisURI)) {
            // Act
            sessionFactory.publish(new UserModel.UserRemovedEvent() {

                @Override
                public RealmModel getRealm() {
                    return session.realms().getRealmByName("openfoodfacts");
                }

                @Override
                public UserModel getUser() {
                    return session.users().getUserById(session.realms().getRealmByName("openfoodfacts"),
                            "theUserId");
                }

                @Override
                public KeycloakSession getKeycloakSession() {
                    return session;
                }

            });

            // Assert
            Map<String, StreamEntryID> streamQuery = new HashMap<>();
            streamQuery.put("user-deleted", new StreamEntryID());
            List<Map.Entry<String, List<StreamEntry>>> result = jedis.xread(XReadParams.xReadParams(), streamQuery);
            Assertions.assertEquals(1, result.size());
            final Map.Entry<String, List<StreamEntry>> entry = result.get(0);
            Assertions.assertEquals("user-deleted", entry.getKey());
            final List<StreamEntry> streamEntries = entry.getValue();
            Assertions.assertEquals(1, streamEntries.size());
            final StreamEntry streamEntry = streamEntries.get(0);
            final Map<String, String> fields = streamEntry.getFields();
            Assertions.assertEquals("theUserId", fields.get("id"));
            Assertions.assertEquals("someUser@example.org", fields.get("email"));
            Assertions.assertEquals("theUserName", fields.get("userName"));
            Assertions.assertEquals("openfoodfacts", fields.get("realm"));
            var newUserName = fields.get("newUserName");
            Assertions.assertTrue(newUserName.startsWith("anonymous-"));
        }
    }
}
