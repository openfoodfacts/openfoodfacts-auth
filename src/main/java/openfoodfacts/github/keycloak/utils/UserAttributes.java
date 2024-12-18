package openfoodfacts.github.keycloak.utils;

public final class UserAttributes {
    public static final String NEWSLETTER = "newsletter";
    public static final String REQUESTED_ORG = "requested_org";
    
    /**
     * ID for the attribute indicating that a user has been fully registered.
     * If this attribute is present, then no "registration" events, ie.
     * a welcome mail, should be sent.
     */
    public static final String REGISTERED = "registered";

    private UserAttributes() {
    }
}
