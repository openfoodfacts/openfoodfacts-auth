package openfoodfacts.github.keycloak.jpa;

import org.junit.jupiter.api.*;

public class DeletedUserEntityProviderFactoryTest {

    @Test
    void testDeletedUserEntityProviderFactoryHasId() {
        // Arrange
        DeletedUserEntityProviderFactory factory = new DeletedUserEntityProviderFactory();

        // Act
        factory.create(null);

        // Assert
        Assertions.assertEquals("deleted-user-entity-provider", factory.getId());
    }

    @Test
    void testDeletedUserEntityProviderFactoryReturnsDeletedUserEntityProvider() {
        // Arrange
        DeletedUserEntityProviderFactory factory = new DeletedUserEntityProviderFactory();

        // Act
        DeletedUserEntityProvider provider = (DeletedUserEntityProvider) factory.create(null);

        // Assert
        Assertions.assertNotNull(provider);
    }

    @Test
    void testDeletedUserEntityProviderFactoryInitCanBeCalledWithoutThrowingAnException() {
        // Arrange
        DeletedUserEntityProviderFactory factory = new DeletedUserEntityProviderFactory();

        // Act/Assert
        factory.init(null);
    }

    @Test
    void testDeletedUserEntityProviderFactoryPostInitCanBeCalledWithoutThrowingAnException() {
        // Arrange
        DeletedUserEntityProviderFactory factory = new DeletedUserEntityProviderFactory();

        // Act/Assert
        factory.postInit(null);
    }

    @Test
    void testDeletedUserEntityProviderFactoryCloseCanBeCalledWithoutThrowingAnException() {
        // Arrange
        DeletedUserEntityProviderFactory factory = new DeletedUserEntityProviderFactory();

        // Act/Assert
        factory.close();
    }

}
