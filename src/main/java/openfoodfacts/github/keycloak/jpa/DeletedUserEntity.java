package openfoodfacts.github.keycloak.jpa;

import jakarta.persistence.*;

import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.UUID;

import org.keycloak.common.util.Time;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.Base32;

@Entity
@Table(name = "DELETED_USER")
public class DeletedUserEntity {

    @Id
    @Column(name = "ID", length = 36)
    private String id;

    @Column(name = "USER_ID", length = 36)
    private String userId;

    @Column(name = "USERNAME")
    protected String username;

    @Column(name = "EMAIL")
    protected String email;

    @Column(name = "CREATED_TIMESTAMP")
    private Long createdTimestamp;

    @Column(name = "DELETED_TIMESTAMP")
    private Long deletedTimestamp;

    @Column(name = "ANONYMOUS_USERNAME")
    private String anonymousUsername;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCreatedTimestamp() {
        return createdTimestamp;
    }

    public void setCreatedTimestamp(Long createdTimestamp) {
        this.createdTimestamp = createdTimestamp;
    }

    public Long getDeletedTimestamp() {
        return deletedTimestamp;
    }

    public void setDeletedTimestamp(Long deletedTimestamp) {
        this.deletedTimestamp = deletedTimestamp;
    }

    public String getAnonymousUsername() {
        return anonymousUsername;
    }

    public void setAnonymousUsername(String anonymousUsername) {
        this.anonymousUsername = anonymousUsername;
    }

    public void generateAnonymousUsername() {
        long currentTimeMillis = System.currentTimeMillis() / 1000; // time in seconds
        int randomNum = new SecureRandom().nextInt(65536); // random number

        ByteBuffer buffer = ByteBuffer.allocate(Long.BYTES);
        buffer.putLong(currentTimeMillis * 65536 + randomNum);
        byte[] packedData = buffer.array();

        String encodedString = Base32.encode(packedData).toLowerCase();

        this.anonymousUsername = "anonymous-" + encodedString;
    }

    public static String logDeletedUser(KeycloakSession session, UserModel user) {
        final DeletedUserEntity entity = new DeletedUserEntity();

        entity.setId(UUID.randomUUID().toString());
        entity.setUserId(user.getId());
        entity.setUsername(user.getUsername());
        entity.setEmail(user.getEmail());
        entity.setCreatedTimestamp(user.getCreatedTimestamp());
        entity.setDeletedTimestamp(Time.currentTimeMillis());
        entity.generateAnonymousUsername();
        session.getProvider(JpaConnectionProvider.class)
                .getEntityManager()
                .persist(entity);

        return entity.getAnonymousUsername();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (!(o instanceof DeletedUserEntity that))
            return false;

        if (!id.equals(that.id))
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
