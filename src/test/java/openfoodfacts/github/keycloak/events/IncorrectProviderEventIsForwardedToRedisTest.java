package openfoodfacts.github.keycloak.events;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledIfEnvironmentVariable;
import org.keycloak.models.ClientModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import redis.clients.jedis.params.XReadParams;
import redis.clients.jedis.resps.StreamEntry;

import com.redis.testcontainers.*;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import redis.clients.jedis.*;

@Testcontainers
@DisabledIfEnvironmentVariable(named = "SKIP_INTEGRATION_TESTS", matches = "true")
public class IncorrectProviderEventIsForwardedToRedisTest {

    @Container
    private static RedisContainer container = new RedisContainer(
            RedisContainer.DEFAULT_IMAGE_NAME.withTag(RedisContainer.DEFAULT_TAG));

    @Test
    void testIncorrectProviderEventEventIsNotForwarded() {
        // Arrange
        String redisURI = container.getRedisURI();
        openfoodfacts.github.keycloak.events.RedisEventListenerProviderFactory factory = new openfoodfacts.github.keycloak.events.RedisEventListenerProviderFactory();
        factory.init(Utils.createScope(redisURI));

        KeycloakSessionFactory sessionFactory = Utils.createKeycloakSessionFactory();
        factory.postInit(sessionFactory);
        try (JedisPooled jedis = new JedisPooled(redisURI)) {
            // Act
            sessionFactory.publish(new ClientModel.ClientRemovedEvent() {

                @Override
                public ClientModel getClient() {
                    throw new UnsupportedOperationException("Unimplemented method 'getClient'");
                }

                @Override
                public KeycloakSession getKeycloakSession() {
                    throw new UnsupportedOperationException("Unimplemented method 'getKeycloakSession'");
                }

            });

            // Assert
            Map<String, StreamEntryID> streamQuery = new HashMap<>();
            streamQuery.put("user-deleted", new StreamEntryID());
            List<Map.Entry<String, List<StreamEntry>>> result = jedis.xread(XReadParams.xReadParams(), streamQuery);
            Assertions.assertNull(result);
        }
    }
}
