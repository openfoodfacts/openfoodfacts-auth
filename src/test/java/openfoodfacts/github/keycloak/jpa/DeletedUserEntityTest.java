package openfoodfacts.github.keycloak.jpa;

import org.junit.jupiter.api.*;

public class DeletedUserEntityTest {

    @Test
    void testDeletedUserEntityGettersAndSetters() {
        // Arrange
        DeletedUserEntity entity = new DeletedUserEntity();
        String id = "123";
        String userId = "456";
        String username = "testuser";
        String email = "testuser@example.com";
        long createdTimestamp = 42;
        long deletedTimestamp = 69;

        // Act
        entity.setId(id);
        entity.setUserId(userId);
        entity.setUsername(username);
        entity.setEmail(email);
        entity.setCreatedTimestamp(createdTimestamp);
        entity.setDeletedTimestamp(deletedTimestamp);
        entity.generateAnonymousUsername();

        // Assert
        Assertions.assertEquals(id, entity.getId());
        Assertions.assertEquals(userId, entity.getUserId());
        Assertions.assertEquals(username, entity.getUsername());
        Assertions.assertEquals(email, entity.getEmail());
        Assertions.assertEquals(createdTimestamp, entity.getCreatedTimestamp());
        Assertions.assertEquals(deletedTimestamp, entity.getDeletedTimestamp());
        Assertions.assertEquals(entity.getAnonymousUsername().toLowerCase(), entity.getAnonymousUsername());
        Assertions.assertTrue(entity.getAnonymousUsername().startsWith("anonymous-"));
    }

    @Test
    void testDeletedUserEntityEqualsAndHashCode() {
        // Arrange
        DeletedUserEntity entity1 = new DeletedUserEntity();
        entity1.setId("123");

        DeletedUserEntity entity2 = new DeletedUserEntity();
        entity2.setId("123");

        DeletedUserEntity entity3 = new DeletedUserEntity();
        entity3.setId("456");

        // Assert
        Assertions.assertEquals(entity1, entity2);
        Assertions.assertNotEquals(entity1, entity3);
        Assertions.assertEquals(entity1.hashCode(), entity2.hashCode());
        Assertions.assertNotEquals(entity1.hashCode(), entity3.hashCode());
    }

}