package openfoodfacts.github.keycloak.jpa;

import java.util.Collections;
import java.util.List;

import org.keycloak.connections.jpa.entityprovider.JpaEntityProvider;

public class DeletedUserEntityProvider implements JpaEntityProvider {

    @Override
    public void close() {
    }

    @Override
    public String getChangelogLocation() {
        return "META-INF/deleted-users-changelog.xml";
    }

    @Override
    public List<Class<?>> getEntities() {
        return Collections.<Class<?>>singletonList(DeletedUserEntity.class);
    }

    @Override
    public String getFactoryId() {
        return DeletedUserEntityProviderFactory.ID;
    }

}
