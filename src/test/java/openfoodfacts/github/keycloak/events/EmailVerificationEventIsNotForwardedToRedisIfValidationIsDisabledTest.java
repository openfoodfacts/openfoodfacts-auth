package openfoodfacts.github.keycloak.events;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledIfEnvironmentVariable;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
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
public class EmailVerificationEventIsNotForwardedToRedisIfValidationIsDisabledTest {

    @Container
    private static RedisContainer container = new RedisContainer(
            RedisContainer.DEFAULT_IMAGE_NAME.withTag(RedisContainer.DEFAULT_TAG));

    @Test
    void testRegisterEventIsForwarded() {
        // Arrange
        String redisURI = container.getRedisURI();
        openfoodfacts.github.keycloak.events.OpenFoodFactsEventListenerProviderFactory factory = new openfoodfacts.github.keycloak.events.OpenFoodFactsEventListenerProviderFactory();
        factory.init(Utils.createScope(redisURI));

        KeycloakSessionFactory sessionFactory = Utils.createKeycloakSessionFactory(false, false);
        KeycloakSession session = sessionFactory.create();
        factory.postInit(sessionFactory);
        EventListenerProvider eventListenerProvider = factory.create(session);
        try (JedisPooled jedis = new JedisPooled(redisURI)) {
            // Act
            eventListenerProvider.onEvent(new Event() {

                @Override
                public String getRealmId() {
                    return "open-products-facts";
                }

                @Override
                public String getUserId() {
                    return "theUserId";
                }

                @Override
                public EventType getType() {
                    return EventType.VERIFY_EMAIL;
                }

            });

            // Assert
            Map<String, StreamEntryID> streamQuery = new HashMap<>();
            streamQuery.put("user-registered", new StreamEntryID());
            List<Map.Entry<String, List<StreamEntry>>> result = jedis.xread(XReadParams.xReadParams(), streamQuery);
            Assertions.assertNull(result);
        }
    }

}
