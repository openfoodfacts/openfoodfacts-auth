package openfoodfacts.github.keycloak.jpa;

import org.junit.jupiter.api.*;

public class DeletedUserEntityProviderTest {

    @Test
    void testDeletedUserEntityProviderIsAssociatedWithCorrectFactoryId() {
        // Arrange/Act
        DeletedUserEntityProvider provider = new DeletedUserEntityProvider();

        // Assert
        Assertions.assertEquals("deleted-user-entity-provider", provider.getFactoryId());
    }

    @Test
    void testDeletedUserEntityProviderReturnsCorrectChangelogLocation() {
        // Arrange/Act
        DeletedUserEntityProvider provider = new DeletedUserEntityProvider();

        // Assert
        Assertions.assertEquals("META-INF/deleted-users-changelog.xml", provider.getChangelogLocation());
    }

    @Test
    void testDeletedUserEntityProviderReturnsListOfEntitiesContainingDeletedUserEntity() {
        // Arrange/Act
        DeletedUserEntityProvider provider = new DeletedUserEntityProvider();

        // Assert
        Assertions.assertEquals(1, provider.getEntities().size());
        Assertions.assertEquals(DeletedUserEntity.class, provider.getEntities().get(0));
    }

    @Test
    void testDeletedUserEntityProviderCloseCanBeCalledWithoutThrowingAnException() {
        // Arrange
        DeletedUserEntityProvider factory = new DeletedUserEntityProvider();

        // Act/Assert
        factory.close();
    }

}
