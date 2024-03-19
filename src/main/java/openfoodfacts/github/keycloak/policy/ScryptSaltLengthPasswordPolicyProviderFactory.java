package openfoodfacts.github.keycloak.policy;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptSaltLengthPasswordPolicyProviderFactory extends ScryptGenericPolicyProviderFactory {
    public static final String ID = "scryptSaltLength";
    public static final int DEFAULT_SALT_LENGTH = 16;

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getDisplayName() {
        return "scrypt Salt Length";
    }

    @Override
    public String getDefaultConfigValue() {
        return String.valueOf(DEFAULT_SALT_LENGTH);
    }

}
