package openfoodfacts.github.keycloak.exceptions;

/**
 * @author <a href="mailto:dries.eestermans@is4u.be">Dries Eestermans</a>
 */
public class ScryptRuntimeException extends RuntimeException {
    public ScryptRuntimeException() {
    }

    public ScryptRuntimeException(String message) {
        super(message);
    }

    public ScryptRuntimeException(String message, Throwable cause) {
        super(message, cause);
    }

    public ScryptRuntimeException(Throwable cause) {
        super(cause);
    }

    public ScryptRuntimeException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
