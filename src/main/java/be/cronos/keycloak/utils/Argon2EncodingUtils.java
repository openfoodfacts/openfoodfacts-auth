package be.cronos.keycloak.utils;

import be.cronos.keycloak.exceptions.Argon2RuntimeException;
import be.cronos.keycloak.policy.Argon2HashLengthPasswordPolicyProviderFactory;
import be.cronos.keycloak.policy.Argon2SaltLengthPasswordPolicyProviderFactory;

import java.util.Base64;

import org.keycloak.common.util.MultivaluedHashMap;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class Argon2EncodingUtils {
    private static final String COST = "N";

    private static final String BLOCK_SIZE = "r";

    private static final String PARALLELISM = "p";

    private Argon2EncodingUtils() {
        // noop
    }

    public static String extractDigest(String encodedPassword) {
        String[] explodedEncodedPassword = encodedPassword.split("\\$");
        if (explodedEncodedPassword.length == 0)
            return null;
        // Digest is always the last value in the split
        return explodedEncodedPassword[explodedEncodedPassword.length - 1];
    }

    public static void setScryptParametersInAdditionalData(Argon2EncodingUtils.Argon2Parameters argon2Parameters,
            MultivaluedHashMap<String, String> additionalData) {
        additionalData.putSingle(COST, Integer.toString(argon2Parameters.getCost()));
        additionalData.putSingle(BLOCK_SIZE, Integer.toString(argon2Parameters.getBlockSize()));
        additionalData.putSingle(PARALLELISM, Integer.toString(argon2Parameters.getParallellism()));
    }

    public static Argon2EncodingUtils.Argon2Parameters extractArgon2ParametersFromCredentials(
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
            throw new Argon2RuntimeException(e.getMessage(), e);
        }
        // If we reach this point, all parameters were found and we return the
        // Argon2Parameters carry object
        return new Argon2EncodingUtils.Argon2Parameters(cost, blockSize, parallelism, hashLength);
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

    public static class Argon2Parameters {
        private final int cost;
        private final int blockSize;
        private final int parallelism;
        private final int hashLength;
        private final int saltLength;

        public Argon2Parameters(int cost, int blockSize, int parallelism) {
            this(cost, blockSize, parallelism, Argon2HashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH,
                    Argon2SaltLengthPasswordPolicyProviderFactory.DEFAULT_SALT_LENGTH);
        }

        public Argon2Parameters(int cost, int blockSize, int parallelism, int hashLength) {
            this(cost, blockSize, parallelism, hashLength,
                    Argon2SaltLengthPasswordPolicyProviderFactory.DEFAULT_SALT_LENGTH);
        }

        public Argon2Parameters(int cost, int blockSize, int parallelism, int hashLength, int saltLength) {
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
