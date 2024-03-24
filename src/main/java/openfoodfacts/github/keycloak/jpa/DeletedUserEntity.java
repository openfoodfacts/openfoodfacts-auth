package openfoodfacts.github.keycloak.jpa;

import jakarta.persistence.*;

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
