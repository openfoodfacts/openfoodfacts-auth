package openfoodfacts.github.keycloak.policy;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptHashLengthPasswordPolicyProviderFactory extends ScryptGenericPolicyProviderFactory {
    public static final String ID = "scryptHashLength";
    public static final int DEFAULT_HASH_LENGTH = 32;

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getDisplayName() {
        return "scrypt Hash Length";
    }

    @Override
    public String getDefaultConfigValue() {
        return String.valueOf(DEFAULT_HASH_LENGTH);
    }

}
