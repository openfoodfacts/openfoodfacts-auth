package openfoodfacts.github.keycloak.policy;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptBlockSizePasswordPolicyProviderFactory extends ScryptGenericPolicyProviderFactory {
    public static final String ID = "scryptr";
    public static final int DEFAULT_BLOCK_SIZE = 8;

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getDisplayName() {
        return "scrypt block size";
    }

    @Override
    public String getDefaultConfigValue() {
        return String.valueOf(DEFAULT_BLOCK_SIZE);
    }

}
