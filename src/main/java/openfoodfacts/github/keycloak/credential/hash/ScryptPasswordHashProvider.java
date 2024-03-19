package openfoodfacts.github.keycloak.credential.hash;

import openfoodfacts.github.keycloak.policy.*;
import openfoodfacts.github.keycloak.utils.ScryptEncodingUtils;
import openfoodfacts.github.keycloak.utils.ScryptHelper;

import org.jboss.logging.Logger;
import org.keycloak.credential.hash.PasswordHashProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.PasswordPolicy;
import org.keycloak.models.credential.PasswordCredentialModel;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptPasswordHashProvider implements PasswordHashProvider {
    private static final Logger LOG = Logger.getLogger(ScryptPasswordHashProvider.class);

    private final String providerId;
    private final KeycloakSession session;

    public ScryptPasswordHashProvider(String providerId, KeycloakSession session) {
        this.providerId = providerId;
        this.session = session;
    }

    @Override
    public boolean policyCheck(PasswordPolicy policy, PasswordCredentialModel credential) {
        LOG.debugf("> policyCheck()");
        // Check it it is an scrypt encoded password.
        if (!providerId.equals(credential.getPasswordCredentialData().getAlgorithm())) {
            LOG.debugf("< policyCheck() -> Stored password uses a different algorithm and hence does not meet the Realm Password Policy.");
            return false;
        }
        // The stored password is a scrypt hash and hence checking the specific parameters of the policy is required.

        // Get the credential's Scrypt parameters
        ScryptEncodingUtils.ScryptParameters storedScryptParameters = ScryptEncodingUtils
                .extractScryptParametersFromCredentials(credential.getPasswordSecretData().getValue(),
                        credential.getPasswordCredentialData().getAdditionalParameters());
        // Get the configured Scrypt parameters
        ScryptEncodingUtils.ScryptParameters configuredScryptParameters = getConfiguredScryptParameters();

        // Perform a comparison on whether a re-hash is needed
        boolean meetsRealmPolicy = storedScryptParameters.getParallellism() == configuredScryptParameters.getParallellism()
                && storedScryptParameters.getCost() == configuredScryptParameters.getCost()
                && storedScryptParameters.getBlockSize() == configuredScryptParameters.getBlockSize();

        LOG.debugf("< policyCheck() -> Stored password meets Realm Password Policy = '%s'.", String.valueOf(meetsRealmPolicy));
        return meetsRealmPolicy;
    }

    @Override
    public PasswordCredentialModel encodedCredential(String rawPassword, int iterations) {
        LOG.debugf("> encodedCredential()");

        // Get the configured Scrypt parameters, or default values
        ScryptEncodingUtils.ScryptParameters configuredScryptParameters = getConfiguredScryptParameters();

        // Generate a salt
        byte[] salt = ScryptHelper.getSalt(configuredScryptParameters.getSaltLength());

        // Retrieve an encoded Scrypt password hash
        String hash = ScryptHelper.hashPassword(
                rawPassword,
                salt,
                configuredScryptParameters.getCost(),
                configuredScryptParameters.getBlockSize(),
                configuredScryptParameters.getParallellism(),
                configuredScryptParameters.getHashLength());

        LOG.debugf("< encodedCredential()");
        return ScryptEncodingUtils.createPasswordCredentialModel(salt, hash, configuredScryptParameters);
    }

    @Override
    public boolean verify(String rawPassword, PasswordCredentialModel credential) {
        LOG.debugf("> verify()");

        // Verify whether the incoming password matches the stored password
        boolean passwordsMatch = ScryptHelper.verifyPassword(rawPassword, credential);

        LOG.debugf("< verify()");
        return passwordsMatch;
    }

    @Override
    public void close() {
        // noop
    }

    private <T> T getDefaultValue(String providerId, T defaultValue) {
        T ret;
        try {
            ret = this.session.getContext().getRealm().getPasswordPolicy().getPolicyConfig(providerId);
        } catch (Exception e) {
            ret = defaultValue;
        }
        if (ret == null) ret = defaultValue;
        return ret;
    }

    private ScryptEncodingUtils.ScryptParameters getConfiguredScryptParameters() {
        return new ScryptEncodingUtils.ScryptParameters(
                getDefaultValue(ScryptCostPasswordPolicyProviderFactory.ID, ScryptCostPasswordPolicyProviderFactory.DEFAULT_COST),
                getDefaultValue(ScryptBlockSizePasswordPolicyProviderFactory.ID, ScryptBlockSizePasswordPolicyProviderFactory.DEFAULT_BLOCK_SIZE),
                getDefaultValue(ScryptParallelismPasswordPolicyProviderFactory.ID, ScryptParallelismPasswordPolicyProviderFactory.DEFAULT_PARALLELISM),
                getDefaultValue(ScryptHashLengthPasswordPolicyProviderFactory.ID, ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH),
                getDefaultValue(ScryptSaltLengthPasswordPolicyProviderFactory.ID, ScryptSaltLengthPasswordPolicyProviderFactory.DEFAULT_SALT_LENGTH)
        );
    }
}
