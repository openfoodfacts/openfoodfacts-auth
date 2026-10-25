package openfoodfacts.github.keycloak.resource;

import org.keycloak.Config.Scope;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.services.resource.RealmResourceProviderFactory;

public class UsernameAvailabilityResourceProviderFactory implements RealmResourceProviderFactory {

    protected static final String ID = "off";

    @Override
    public void close() {
    }

    @Override
    public RealmResourceProvider create(KeycloakSession session) {
        return new UsernameAvailabilityResourceProvider(session);
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
