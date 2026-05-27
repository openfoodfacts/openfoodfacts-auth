package openfoodfacts.github.keycloak.resource;

import java.util.List;
import java.util.Map;

import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.userprofile.UserProfile;
import org.keycloak.userprofile.UserProfileContext;
import org.keycloak.userprofile.UserProfileProvider;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.CacheControl;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

public class UsernameAvailabilityResourceProvider implements RealmResourceProvider {

    private final KeycloakSession session;

    public UsernameAvailabilityResourceProvider(KeycloakSession session) {
        this.session = session;
    }

    @GET
    @Path("username-available")
    @Produces(MediaType.APPLICATION_JSON)
    public Response usernameAvailable(@QueryParam("u") String username) {
        final boolean available = isFormatValid(username) && !exists(username);

        final CacheControl noStore = new CacheControl();
        noStore.setNoStore(true);

        return Response.ok(Map.of("available", available)).cacheControl(noStore).build();
    }

    // Delegates format / length / pattern checks to the validators configured
    // in runtime-scripts/users_profile.json — no rules are duplicated here.
    private boolean isFormatValid(String username) {
        if (username == null) {
            return false;
        }
        final UserProfileProvider provider = session.getProvider(UserProfileProvider.class);
        final UserProfile profile = provider.create(
            UserProfileContext.REGISTRATION,
            Map.of(UserModel.USERNAME, List.of(username))
        );
        return profile.getAttributes().validate(UserModel.USERNAME);
    }

    private boolean exists(String username) {
        final RealmModel realm = session.getContext().getRealm();
        return session.users().getUserByUsername(realm, username) != null;
    }

    @Override
    public Object getResource() {
        return this;
    }

    @Override
    public void close() {
    }
}
