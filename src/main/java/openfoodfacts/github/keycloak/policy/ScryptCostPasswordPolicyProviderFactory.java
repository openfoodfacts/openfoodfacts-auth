package openfoodfacts.github.keycloak.policy;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptCostPasswordPolicyProviderFactory extends ScryptGenericPolicyProviderFactory {
    public static final String ID = "scryptN";
    public static final int DEFAULT_COST = 16384;

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getDisplayName() {
        return "scrypt CPU/memory cost";
    }

    @Override
    public String getDefaultConfigValue() {
        return String.valueOf(DEFAULT_COST);
    }

}
