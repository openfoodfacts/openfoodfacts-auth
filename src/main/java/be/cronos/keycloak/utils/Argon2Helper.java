package be.cronos.keycloak.utils;

import be.cronos.keycloak.exceptions.Argon2RuntimeException;
import org.bouncycastle.crypto.generators.SCrypt;
import org.bouncycastle.util.Strings;
import org.jboss.logging.Logger;
import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.models.credential.PasswordCredentialModel;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class Argon2Helper {
    private static final Logger LOG = Logger.getLogger(Argon2Helper.class);

    private static final Charset CHARSET = StandardCharsets.UTF_8;

    private Argon2Helper() {
        throw new IllegalStateException("Helper class");
    }

    public static String hashPassword(String rawPassword, byte[] salt, int N,
            int r, int p, int dkLen) {

        if (rawPassword == null)
            throw new Argon2RuntimeException("Password can't be empty");

        LOG.debugf("Using the following Argon2 settings:");
        LOG.debugf("\tCPU/memory cost: %d", N);
        LOG.debugf("\tBlock Size: %d", r);
        LOG.debugf("\tParallellism: %d", p);
        LOG.debugf("\tDerived Key Length: %d", dkLen);
        LOG.debugf("\tSalt Length: %d", salt.length);

        try {
            // Keep track of hashing runtime
            long start = System.currentTimeMillis();

            // Perform the hashing
            byte[] result = SCrypt.generate(rawPassword.getBytes(CHARSET), salt, N, r, p, dkLen);

            // Stop timing
            long end = System.currentTimeMillis();

            // Print the hashing runtime for debug purposes
            LOG.debugf("Hashing runtime was %d milliseconds (%d seconds).", end - start, (end - start) / 1000);

            // Return an encoded representation of the argon2 password hash
            return Base64.getEncoder().withoutPadding().encodeToString(result);
        } catch (Exception e) {
            LOG.errorf("Something went wrong while hashing the password, message = '%s'", e.getMessage());
        }
        throw new Argon2RuntimeException("Something went wrong while securing the password.");
    }

    public static boolean verifyPassword(String rawPassword, PasswordCredentialModel credential) {
        // Retrieve the stored encoded password
        String storedEncodedPassword = credential.getPasswordSecretData().getValue();
        // Retrieved the salt
        byte[] salt = credential.getPasswordSecretData().getSalt();
        // Extract all the stored parameters
        MultivaluedHashMap<String, String> additionalParameters = credential.getPasswordCredentialData().getAdditionalParameters();
        if (additionalParameters == null) {
            LOG.errorf("There's something wrong with the stored password encoding, couldn't find the parameters.");
            throw new Argon2RuntimeException("Something went wrong.");
        }

        Argon2EncodingUtils.Argon2Parameters argon2Parameters = Argon2EncodingUtils
                .extractArgon2ParametersFromCredentials(storedEncodedPassword, additionalParameters);

        // Extract the digest
        String storedPasswordDigest = Argon2EncodingUtils.extractDigest(storedEncodedPassword);
        if (storedPasswordDigest == null) {
            LOG.errorf("There's something wrong with the stored password encoding, couldn't find the actual hash.");
            throw new Argon2RuntimeException("Something went wrong.");
        }

        // Hash the incoming password (according to stored password's parameters)
        String attemptedEncodedPassword = hashPassword(
                rawPassword,
                salt,
                argon2Parameters.getCost(),
                argon2Parameters.getBlockSize(),
                argon2Parameters.getParallellism(),
                argon2Parameters.getHashLength());

        // Extract the digest of the attempted hashed password
        String attemptedPasswordDigest = Argon2EncodingUtils.extractDigest(attemptedEncodedPassword);
        if (attemptedPasswordDigest == null) {
            LOG.errorf("There's something wrong with the attempted password encoding, couldn't find the actual hash.");
            throw new Argon2RuntimeException("Something went wrong.");
        }

        // Compare the 2 digests using constant-time comparison
        boolean samePassword = MessageDigest.isEqual(Strings.toByteArray(storedPasswordDigest),
                Strings.toByteArray(attemptedPasswordDigest));

        LOG.debugf("Password match = %s", String.valueOf(samePassword));

        return samePassword;
    }

    public static byte[] getSalt(int saltLength) {
        LOG.debugf("Generating salt with length '%d'.", saltLength);
        byte[] buffer = new byte[saltLength];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(buffer);
        return buffer;
    }
}
