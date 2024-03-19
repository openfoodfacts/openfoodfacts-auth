package openfoodfacts.github.keycloak.utils;

import openfoodfacts.github.keycloak.credential.hash.ScryptPasswordHashProviderFactory;
import openfoodfacts.github.keycloak.exceptions.ScryptRuntimeException;
import openfoodfacts.github.keycloak.policy.ScryptHashLengthPasswordPolicyProviderFactory;
import openfoodfacts.github.keycloak.policy.ScryptSaltLengthPasswordPolicyProviderFactory;

import java.io.IOException;
import java.util.Base64;

import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.models.credential.PasswordCredentialModel;
import org.keycloak.models.credential.dto.PasswordCredentialData;
import org.keycloak.models.credential.dto.PasswordSecretData;
import org.keycloak.util.JsonSerialization;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptEncodingUtils {
    private static final String COST = "N";

    private static final String BLOCK_SIZE = "r";

    private static final String PARALLELISM = "p";

    private ScryptEncodingUtils() {
        // noop
    }

    public static String extractDigest(String encodedPassword) {
        String[] explodedEncodedPassword = encodedPassword.split("\\$");
        if (explodedEncodedPassword.length == 0)
            return null;
        // Digest is always the last value in the split
        return explodedEncodedPassword[explodedEncodedPassword.length - 1];
    }

    public static PasswordCredentialModel createPasswordCredentialModel(byte[] salt, String encodedPassword,
            ScryptEncodingUtils.ScryptParameters scryptParameters) {
        PasswordCredentialData credentialData = new PasswordCredentialData(-1, ScryptPasswordHashProviderFactory.ID);
        PasswordSecretData secretData = new PasswordSecretData(encodedPassword, salt);
        MultivaluedHashMap<String, String> additionalParameters = credentialData.getAdditionalParameters();
        additionalParameters.putSingle(ScryptEncodingUtils.COST, Integer.toString(scryptParameters.getCost()));
        additionalParameters.putSingle(ScryptEncodingUtils.BLOCK_SIZE,
                Integer.toString(scryptParameters.getBlockSize()));
        additionalParameters.putSingle(ScryptEncodingUtils.PARALLELISM,
                Integer.toString(scryptParameters.getParallellism()));

        PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(credentialData,
                secretData);

        try {
            passwordCredentialModel.setCredentialData(JsonSerialization.writeValueAsString(credentialData));
            passwordCredentialModel.setSecretData(JsonSerialization.writeValueAsString(secretData));
            passwordCredentialModel.setType(PasswordCredentialModel.TYPE);
            return passwordCredentialModel;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static ScryptEncodingUtils.ScryptParameters extractScryptParametersFromCredentials(
            final String storedEncodedPassword,
            final MultivaluedHashMap<String, String> credentialParameters) {
        if (credentialParameters == null) {
            throw new IllegalArgumentException("Additional credential parameters are 'null'");
        }

        // Declare separate fields which are contained within the encoded password hash
        int cost;
        int blockSize;
        int parallelism;
        int hashLength;
        // Now attempt to extract all the parameters
        try {
            cost = extractCost(credentialParameters);
            blockSize = extractBlockSize(credentialParameters);
            parallelism = extractParallelism(credentialParameters);
            hashLength = getDigestLength(storedEncodedPassword);
        } catch (Exception e) {
            throw new ScryptRuntimeException(e.getMessage(), e);
        }
        // If we reach this point, all parameters were found and we return the
        // ScryptParameters carry object
        return new ScryptEncodingUtils.ScryptParameters(cost, blockSize, parallelism, hashLength);
    }

    public static int extractCost(MultivaluedHashMap<String, String> credentialParameters) {
        return Integer.parseInt(
                credentialParameters.getFirst(COST));
    }

    public static int extractBlockSize(MultivaluedHashMap<String, String> credentialParameters) {
        return Integer.parseInt(
                credentialParameters.getFirst(BLOCK_SIZE));
    }

    public static int extractParallelism(MultivaluedHashMap<String, String> credentialParameters) {
        return Integer.parseInt(
                credentialParameters.getFirst(PARALLELISM));
    }

    public static int getDigestLength(String base64EncodedString) {
        return Base64.getDecoder().decode(base64EncodedString).length;
    }

    public static class ScryptParameters {
        private final int cost;
        private final int blockSize;
        private final int parallelism;
        private final int hashLength;
        private final int saltLength;

        public ScryptParameters(int cost, int blockSize, int parallelism) {
            this(cost, blockSize, parallelism, ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH,
                    ScryptSaltLengthPasswordPolicyProviderFactory.DEFAULT_SALT_LENGTH);
        }

        public ScryptParameters(int cost, int blockSize, int parallelism, int hashLength) {
            this(cost, blockSize, parallelism, hashLength,
                    ScryptSaltLengthPasswordPolicyProviderFactory.DEFAULT_SALT_LENGTH);
        }

        public ScryptParameters(int cost, int blockSize, int parallelism, int hashLength, int saltLength) {
            this.cost = cost;
            this.blockSize = blockSize;
            this.parallelism = parallelism;
            this.hashLength = hashLength;
            this.saltLength = saltLength;
        }

        public int getParallellism() {
            return parallelism;
        }

        public int getCost() {
            return cost;
        }

        public int getBlockSize() {
            return blockSize;
        }

        public int getHashLength() {
            return hashLength;
        }

        public int getSaltLength() {
            return saltLength;
        }
    }
}
