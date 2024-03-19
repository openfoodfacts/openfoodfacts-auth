package openfoodfacts.github.keycloak.policy;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptParallelismPasswordPolicyProviderFactory extends ScryptGenericPolicyProviderFactory {
    public static final String ID = "scryptp";
    public static final int DEFAULT_PARALLELISM = 1;

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getDisplayName() {
        return "scrypt Parallelism";
    }

    @Override
    public String getDefaultConfigValue() {
        return String.valueOf(DEFAULT_PARALLELISM);
    }
}
