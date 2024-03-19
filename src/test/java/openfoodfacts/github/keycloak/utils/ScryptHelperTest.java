package openfoodfacts.github.keycloak.utils;

import java.util.Base64;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.models.credential.PasswordCredentialModel;

import openfoodfacts.github.keycloak.credential.hash.ScryptPasswordHashProviderFactory;
import openfoodfacts.github.keycloak.policy.ScryptHashLengthPasswordPolicyProviderFactory;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptHelperTest {

    private static final String ALGORITHM = ScryptPasswordHashProviderFactory.ID;

    private static final int DEFAULT_COST = 16384;

    private static final int DEFAULT_BLOCK_SIZE = 8;

    private static final int DEFAULT_PARALLELISM = 1;

    private static byte[] salt;

    @BeforeEach
    public void generateSalt() {
        salt = ScryptHelper.getSalt(16);
    }

    @Test
    public void testScryptdHashAndVerifySamePassword() {
        int cost = DEFAULT_COST;
        String rawPassword = "123456789";
        String hash = ScryptHelper.hashPassword(
                rawPassword,
                salt,
                cost,
                DEFAULT_BLOCK_SIZE,
                DEFAULT_PARALLELISM,
                ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH);
        PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(ALGORITHM, salt,
                cost, hash);
        passwordCredentialModel.setSecretData(hash);
        setAdditionalParameters(
                passwordCredentialModel,
                cost,
                DEFAULT_BLOCK_SIZE,
                DEFAULT_PARALLELISM);
        boolean verified = ScryptHelper.verifyPassword(rawPassword, passwordCredentialModel);
        Assertions.assertTrue(verified);
    }

    @Test
    public void testScryptdHashAndVerifyDifferentPassword() {
        int cost = DEFAULT_COST;
        String rawPassword = "iloveyou";
        String hash = ScryptHelper.hashPassword(
                rawPassword,
                salt,
                cost,
                DEFAULT_BLOCK_SIZE,
                DEFAULT_PARALLELISM,
                ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH);
        PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(ALGORITHM, salt,
                cost, hash);
        passwordCredentialModel.setSecretData(hash);
        setAdditionalParameters(
                passwordCredentialModel,
                cost,
                DEFAULT_BLOCK_SIZE,
                DEFAULT_PARALLELISM);
        boolean verified = ScryptHelper.verifyPassword("gwerty123", passwordCredentialModel);
        Assertions.assertFalse(verified);
    }

        @Test
        public void testScryptdVerifyPredefinedHash() {
                String rawPassword = "supersecret";
                String hash = "OaqIIbkVDDjH3OvyrkHAsUvIARzbhMD7REHMHmxjdPQ=";
                PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(
                                ALGORITHM,
                                Base64.getDecoder().decode("kGPbRh+TIQIzn/A2DtHp5dZRMSrqRIrLlrOLPH8a/1A="),
                                DEFAULT_COST,
                                hash);
                passwordCredentialModel.setSecretData(hash);
                setAdditionalParameters(
                                passwordCredentialModel,
                                DEFAULT_COST,
                                DEFAULT_BLOCK_SIZE,
                                DEFAULT_PARALLELISM);
                boolean verified = ScryptHelper.verifyPassword(rawPassword, passwordCredentialModel);
                Assertions.assertTrue(verified);
        }

    @Test
    public void testScryptdVerifyPredefinedWrongHash() {
        String rawPassword = "supersecret";
        String hash = "TMoKd43AKZSsDakIZf52DccKPvQQNUE//wmOl5gxvIM=";
        PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(
                ALGORITHM,
                Base64.getDecoder().decode("kGPbRh+TIQIzn/A2DtHp5dZRMSrqRIrLlrOLPH8a/1A="),
                DEFAULT_COST,
                hash);
        passwordCredentialModel.setSecretData(hash);
        setAdditionalParameters(
                passwordCredentialModel,
                DEFAULT_COST,
                DEFAULT_BLOCK_SIZE,
                DEFAULT_PARALLELISM);
        boolean verified = ScryptHelper.verifyPassword(rawPassword, passwordCredentialModel);
        Assertions.assertFalse(verified);
    }

    @Test
    public void testScryptdVerifyPredefinedWrongSalt() {
        String rawPassword = "supersecret";
        String hash = "OaqIIbkVDDjH3OvyrkHAsUvIARzbhMD7REHMHmxjdPQ";
        PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(
                ALGORITHM,
                salt,
                DEFAULT_COST,
                hash);
        passwordCredentialModel.setSecretData(hash);
        setAdditionalParameters(
                passwordCredentialModel,
                DEFAULT_COST,
                DEFAULT_BLOCK_SIZE,
                DEFAULT_PARALLELISM);
        boolean verified = ScryptHelper.verifyPassword(rawPassword, passwordCredentialModel);
        Assertions.assertFalse(verified);
    }

    @Test
    public void testHashPasswordHashEmptyPassword() {
        Assertions.assertThrows(
                RuntimeException.class,
                () -> ScryptHelper.hashPassword(
                        null,
                        salt,
                        DEFAULT_COST,
                        DEFAULT_BLOCK_SIZE,
                        DEFAULT_PARALLELISM,
                        ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH));
    }

    @Test
    public void testHashPasswordNoAlgorithm() {
        String rawPassword = "novariantdefined";
        String tamperedHash = "$$v=19$m=65536,t=1,p=1$zGFM95kyhWZyZv1Hhvjuog$G78Vd4nXEqN0DKbF+qGj1pUNyEpEZmOWqEqlHFDllJY";
        PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(ALGORITHM, salt,
                DEFAULT_COST, tamperedHash);
        passwordCredentialModel.setSecretData(tamperedHash);
        Assertions.assertThrows(RuntimeException.class,
                () -> ScryptHelper.verifyPassword(rawPassword, passwordCredentialModel));
    }

    @Test
    public void testHashPasswordNegativeIterations() {
        int iterations = -1;
        String rawPassword = "novariantdefined";
        Executable exec = () -> ScryptHelper.hashPassword(
                rawPassword,
                salt,
                iterations,
                DEFAULT_BLOCK_SIZE,
                DEFAULT_PARALLELISM,
                ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH);
        Assertions.assertThrows(RuntimeException.class, exec);
    }

    @Test
    public void testHashPasswordNoParallelism() {
        int parallelism = 0;
        String rawPassword = "novariantdefined";
        Executable call = () -> ScryptHelper.hashPassword(
                rawPassword,
                salt,
                DEFAULT_COST,
                DEFAULT_BLOCK_SIZE,
                parallelism,
                ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH);
        Assertions.assertThrows(RuntimeException.class, call);
    }

    @Test
    public void testHashPasswordNoMemory() {
        int memory = 0;
        String rawPassword = "novariantdefined";
        Executable call = () -> ScryptHelper.hashPassword(
                rawPassword,
                salt,
                DEFAULT_COST,
                memory,
                DEFAULT_PARALLELISM,
                ScryptHashLengthPasswordPolicyProviderFactory.DEFAULT_HASH_LENGTH);
        Assertions.assertThrows(RuntimeException.class, call);
    }

    @Test
    public void testVerifyPasswordNonsenseData() {
        String rawPassword = "testscryptid";
        String hash = "nonsense";
        PasswordCredentialModel passwordCredentialModel = PasswordCredentialModel.createFromValues(ALGORITHM,
                "".getBytes(), DEFAULT_COST, hash);
        passwordCredentialModel.setSecretData(hash);
        Assertions.assertThrows(RuntimeException.class,
                () -> ScryptHelper.verifyPassword(rawPassword, passwordCredentialModel));
    }

    private static void setAdditionalParameters(PasswordCredentialModel passwordCredentialModel, int N, int r, int p) {
        MultivaluedHashMap<String, String> additionalParameters = passwordCredentialModel.getPasswordCredentialData()
                .getAdditionalParameters();
        additionalParameters.putSingle("N", Integer.toString(N));
        additionalParameters.putSingle("r", Integer.toString(r));
        additionalParameters.putSingle("p", Integer.toString(p));
    }

}
