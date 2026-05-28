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
        final String status = checkStatus(username);

        final CacheControl noStore = new CacheControl();
        noStore.setNoStore(true);

        return Response.ok(Map.of("status", status)).cacheControl(noStore).build();
    }

    // Existence is checked before format on purpose: UserProfile validation in the REGISTRATION
    // context bundles the uniqueness check with format validators, which would conflate "taken"
    // and "invalid" if format ran first. Looking up the user up-front separates the two cleanly.
    private String checkStatus(String username) {
        if (username == null || username.isEmpty()) {
            return "invalid";
        }
        if (exists(username)) {
            return "taken";
        }
        return isFormatValid(username) ? "available" : "invalid";
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
