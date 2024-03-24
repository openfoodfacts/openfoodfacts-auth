package openfoodfacts.github.keycloak.jpa;

import org.keycloak.Config.Scope;
import org.keycloak.connections.jpa.entityprovider.JpaEntityProvider;
import org.keycloak.connections.jpa.entityprovider.JpaEntityProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

public class DeletedUserEntityProviderFactory implements JpaEntityProviderFactory {

    protected static final String ID = "deleted-user-entity-provider";

    @Override
    public void close() {
    }

    @Override
    public JpaEntityProvider create(KeycloakSession arg0) {
        return new DeletedUserEntityProvider();
    }

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public void init(Scope arg0) {
    }

    @Override
    public void postInit(KeycloakSessionFactory arg0) {
    }

}
