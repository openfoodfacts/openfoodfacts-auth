package openfoodfacts.github.keycloak.events;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Stream;

import org.keycloak.Config.Scope;
import org.keycloak.common.enums.SslRequired;
import org.keycloak.common.util.Time;
import org.keycloak.component.ComponentModel;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.AuthenticationFlowModel;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.CibaConfig;
import org.keycloak.models.ClientInitialAccessModel;
import org.keycloak.models.ClientModel;
import org.keycloak.models.ClientProvider;
import org.keycloak.models.ClientScopeModel;
import org.keycloak.models.ClientScopeProvider;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.GroupModel;
import org.keycloak.models.GroupProvider;
import org.keycloak.models.IdentityProviderMapperModel;
import org.keycloak.models.IdentityProviderModel;
import org.keycloak.models.IdentityProviderStorageProvider;
import org.keycloak.models.KeyManager;
import org.keycloak.models.KeycloakContext;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.KeycloakTransactionManager;
import org.keycloak.models.OAuth2DeviceConfig;
import org.keycloak.models.OTPPolicy;
import org.keycloak.models.ParConfig;
import org.keycloak.models.PasswordPolicy;
import org.keycloak.models.ProtocolMapperModel;
import org.keycloak.models.RealmModel;
import org.keycloak.models.RealmProvider;
import org.keycloak.models.RequiredActionConfigModel;
import org.keycloak.models.RequiredActionProviderModel;
import org.keycloak.models.RequiredCredentialModel;
import org.keycloak.models.RoleModel;
import org.keycloak.models.RoleProvider;
import org.keycloak.models.SingleUseObjectProvider;
import org.keycloak.models.SubjectCredentialManager;
import org.keycloak.models.ThemeManager;
import org.keycloak.models.TokenManager;
import org.keycloak.models.UserConsentModel;
import org.keycloak.models.UserLoginFailureProvider;
import org.keycloak.models.UserModel;
import org.keycloak.models.UserProvider;
import org.keycloak.models.UserSessionProvider;
import org.keycloak.models.WebAuthnPolicy;
import org.keycloak.provider.InvalidationHandler.InvalidableObjectType;
import org.keycloak.provider.Provider;
import org.keycloak.provider.ProviderEvent;
import org.keycloak.provider.ProviderEventListener;
import org.keycloak.provider.ProviderFactory;
import org.keycloak.provider.Spi;
import org.keycloak.representations.idm.RealmRepresentation.BruteForceStrategy;
import org.keycloak.services.clientpolicy.ClientPolicyManager;
import org.keycloak.sessions.AuthenticationSessionProvider;
import org.keycloak.vault.VaultTranscriber;

import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.FlushModeType;
import jakarta.persistence.LockModeType;
import jakarta.persistence.Query;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.CriteriaUpdate;
import jakarta.persistence.metamodel.Metamodel;

class Utils {
    public static Scope createScope(final String redisURI) {
        return new Scope() {
            @Override
            public String get(final String key) {
                if (key.equals("redisUrl")) {
                    return redisURI;
                }

                return null;
            }

            @Override
            public String get(String key, String defaultValue) {
                throw new UnsupportedOperationException("Unimplemented method 'get'");
            }

            @Override
            public String[] getArray(String key) {
                throw new UnsupportedOperationException("Unimplemented method 'getArray'");
            }

            @Override
            public Integer getInt(String key) {
                throw new UnsupportedOperationException("Unimplemented method 'getInt'");
            }

            @Override
            public Integer getInt(String key, Integer defaultValue) {
                throw new UnsupportedOperationException("Unimplemented method 'getInt'");
            }

            @Override
            public Long getLong(String key) {
                throw new UnsupportedOperationException("Unimplemented method 'getLong'");
            }

            @Override
            public Long getLong(String key, Long defaultValue) {
                throw new UnsupportedOperationException("Unimplemented method 'getLong'");
            }

            @Override
            public Boolean getBoolean(String key) {
                throw new UnsupportedOperationException("Unimplemented method 'getBoolean'");
            }

            @Override
            public Boolean getBoolean(String key, Boolean defaultValue) {
                throw new UnsupportedOperationException("Unimplemented method 'getBoolean'");
            }

            @Override
            public Scope scope(String... scope) {
                throw new UnsupportedOperationException("Unimplemented method 'scope'");
            }

            @Override
            public Set<String> getPropertyNames() {
                throw new UnsupportedOperationException("Unimplemented method 'getPropertyNames'");
            }
        };
    }

    public static KeycloakSession createKeycloakSession(final boolean isVerifyEmail, final boolean isEmailVerified,
            final String userNewsletterAttribute, final String initialRegisteredAttribute) {
        return new KeycloakSession() {

            @Override
            public KeycloakContext getContext() {
                throw new UnsupportedOperationException("Unimplemented method 'getContext'");
            }

            @Override
            public KeycloakTransactionManager getTransactionManager() {
                throw new UnsupportedOperationException("Unimplemented method 'getTransactionManager'");
            }

            @SuppressWarnings("unchecked")
            @Override
            public <PT extends Provider> PT getProvider(Class<PT> clazz) {
                return (PT) new JpaConnectionProvider() {
                    @Override
                    public void close() {
                        throw new UnsupportedOperationException("Unimplemented method 'close'");
                    }

                    @Override
                    public EntityManager getEntityManager() {
                        return new EntityManager() {

                            @Override
                            public void persist(Object entity) {
                            }

                            @Override
                            public <T> T merge(T entity) {
                                throw new UnsupportedOperationException("Unimplemented method 'merge'");
                            }

                            @Override
                            public void remove(Object entity) {
                                throw new UnsupportedOperationException("Unimplemented method 'remove'");
                            }

                            @Override
                            public <T> T find(Class<T> entityClass, Object primaryKey) {
                                throw new UnsupportedOperationException("Unimplemented method 'find'");
                            }

                            @Override
                            public <T> T find(Class<T> entityClass, Object primaryKey, Map<String, Object> properties) {
                                throw new UnsupportedOperationException("Unimplemented method 'find'");
                            }

                            @Override
                            public <T> T find(Class<T> entityClass, Object primaryKey, LockModeType lockMode) {
                                throw new UnsupportedOperationException("Unimplemented method 'find'");
                            }

                            @Override
                            public <T> T find(Class<T> entityClass, Object primaryKey, LockModeType lockMode,
                                    Map<String, Object> properties) {
                                throw new UnsupportedOperationException("Unimplemented method 'find'");
                            }

                            @Override
                            public <T> T getReference(Class<T> entityClass, Object primaryKey) {
                                throw new UnsupportedOperationException("Unimplemented method 'getReference'");
                            }

                            @Override
                            public void flush() {
                                throw new UnsupportedOperationException("Unimplemented method 'flush'");
                            }

                            @Override
                            public void setFlushMode(FlushModeType flushMode) {
                                throw new UnsupportedOperationException("Unimplemented method 'setFlushMode'");
                            }

                            @Override
                            public FlushModeType getFlushMode() {
                                throw new UnsupportedOperationException("Unimplemented method 'getFlushMode'");
                            }

                            @Override
                            public void lock(Object entity, LockModeType lockMode) {
                                throw new UnsupportedOperationException("Unimplemented method 'lock'");
                            }

                            @Override
                            public void lock(Object entity, LockModeType lockMode, Map<String, Object> properties) {
                                throw new UnsupportedOperationException("Unimplemented method 'lock'");
                            }

                            @Override
                            public void refresh(Object entity) {
                                throw new UnsupportedOperationException("Unimplemented method 'refresh'");
                            }

                            @Override
                            public void refresh(Object entity, Map<String, Object> properties) {
                                throw new UnsupportedOperationException("Unimplemented method 'refresh'");
                            }

                            @Override
                            public void refresh(Object entity, LockModeType lockMode) {
                                throw new UnsupportedOperationException("Unimplemented method 'refresh'");
                            }

                            @Override
                            public void refresh(Object entity, LockModeType lockMode, Map<String, Object> properties) {
                                throw new UnsupportedOperationException("Unimplemented method 'refresh'");
                            }

                            @Override
                            public void clear() {
                                throw new UnsupportedOperationException("Unimplemented method 'clear'");
                            }

                            @Override
                            public void detach(Object entity) {
                                throw new UnsupportedOperationException("Unimplemented method 'detach'");
                            }

                            @Override
                            public boolean contains(Object entity) {
                                throw new UnsupportedOperationException("Unimplemented method 'contains'");
                            }

                            @Override
                            public LockModeType getLockMode(Object entity) {
                                throw new UnsupportedOperationException("Unimplemented method 'getLockMode'");
                            }

                            @Override
                            public void setProperty(String propertyName, Object value) {
                                throw new UnsupportedOperationException("Unimplemented method 'setProperty'");
                            }

                            @Override
                            public Map<String, Object> getProperties() {
                                throw new UnsupportedOperationException("Unimplemented method 'getProperties'");
                            }

                            @Override
                            public Query createQuery(String qlString) {
                                throw new UnsupportedOperationException("Unimplemented method 'createQuery'");
                            }

                            @Override
                            public <T> TypedQuery<T> createQuery(CriteriaQuery<T> criteriaQuery) {
                                throw new UnsupportedOperationException("Unimplemented method 'createQuery'");
                            }

                            @Override
                            public Query createQuery(CriteriaUpdate updateQuery) {
                                throw new UnsupportedOperationException("Unimplemented method 'createQuery'");
                            }

                            @Override
                            public Query createQuery(CriteriaDelete deleteQuery) {
                                throw new UnsupportedOperationException("Unimplemented method 'createQuery'");
                            }

                            @Override
                            public <T> TypedQuery<T> createQuery(String qlString, Class<T> resultClass) {
                                throw new UnsupportedOperationException("Unimplemented method 'createQuery'");
                            }

                            @Override
                            public Query createNamedQuery(String name) {
                                throw new UnsupportedOperationException("Unimplemented method 'createNamedQuery'");
                            }

                            @Override
                            public <T> TypedQuery<T> createNamedQuery(String name, Class<T> resultClass) {
                                throw new UnsupportedOperationException("Unimplemented method 'createNamedQuery'");
                            }

                            @Override
                            public Query createNativeQuery(String sqlString) {
                                throw new UnsupportedOperationException("Unimplemented method 'createNativeQuery'");
                            }

                            @Override
                            public Query createNativeQuery(String sqlString, Class resultClass) {
                                throw new UnsupportedOperationException("Unimplemented method 'createNativeQuery'");
                            }

                            @Override
                            public Query createNativeQuery(String sqlString, String resultSetMapping) {
                                throw new UnsupportedOperationException("Unimplemented method 'createNativeQuery'");
                            }

                            @Override
                            public StoredProcedureQuery createNamedStoredProcedureQuery(String name) {
                                throw new UnsupportedOperationException(
                                        "Unimplemented method 'createNamedStoredProcedureQuery'");
                            }

                            @Override
                            public StoredProcedureQuery createStoredProcedureQuery(String procedureName) {
                                throw new UnsupportedOperationException(
                                        "Unimplemented method 'createStoredProcedureQuery'");
                            }

                            @Override
                            public StoredProcedureQuery createStoredProcedureQuery(String procedureName,
                                    Class... resultClasses) {
                                throw new UnsupportedOperationException(
                                        "Unimplemented method 'createStoredProcedureQuery'");
                            }

                            @Override
                            public StoredProcedureQuery createStoredProcedureQuery(String procedureName,
                                    String... resultSetMappings) {
                                throw new UnsupportedOperationException(
                                        "Unimplemented method 'createStoredProcedureQuery'");
                            }

                            @Override
                            public void joinTransaction() {
                                throw new UnsupportedOperationException("Unimplemented method 'joinTransaction'");
                            }

                            @Override
                            public boolean isJoinedToTransaction() {
                                throw new UnsupportedOperationException("Unimplemented method 'isJoinedToTransaction'");
                            }

                            @Override
                            public <T> T unwrap(Class<T> cls) {
                                throw new UnsupportedOperationException("Unimplemented method 'unwrap'");
                            }

                            @Override
                            public Object getDelegate() {
                                throw new UnsupportedOperationException("Unimplemented method 'getDelegate'");
                            }

                            @Override
                            public void close() {
                                throw new UnsupportedOperationException("Unimplemented method 'close'");
                            }

                            @Override
                            public boolean isOpen() {
                                throw new UnsupportedOperationException("Unimplemented method 'isOpen'");
                            }

                            @Override
                            public EntityTransaction getTransaction() {
                                throw new UnsupportedOperationException("Unimplemented method 'getTransaction'");
                            }

                            @Override
                            public EntityManagerFactory getEntityManagerFactory() {
                                throw new UnsupportedOperationException(
                                        "Unimplemented method 'getEntityManagerFactory'");
                            }

                            @Override
                            public CriteriaBuilder getCriteriaBuilder() {
                                throw new UnsupportedOperationException("Unimplemented method 'getCriteriaBuilder'");
                            }

                            @Override
                            public Metamodel getMetamodel() {
                                throw new UnsupportedOperationException("Unimplemented method 'getMetamodel'");
                            }

                            @Override
                            public <T> EntityGraph<T> createEntityGraph(Class<T> rootType) {
                                throw new UnsupportedOperationException("Unimplemented method 'createEntityGraph'");
                            }

                            @Override
                            public EntityGraph<?> createEntityGraph(String graphName) {
                                throw new UnsupportedOperationException("Unimplemented method 'createEntityGraph'");
                            }

                            @Override
                            public EntityGraph<?> getEntityGraph(String graphName) {
                                throw new UnsupportedOperationException("Unimplemented method 'getEntityGraph'");
                            }

                            @Override
                            public <T> List<EntityGraph<? super T>> getEntityGraphs(Class<T> entityClass) {
                                throw new UnsupportedOperationException("Unimplemented method 'getEntityGraphs'");
                            }
                        };
                    }
                };
            }

            @Override
            @Deprecated
            public <T extends Provider> T getProvider(Class<T> clazz, String id) {
                throw new UnsupportedOperationException("Unimplemented method 'getProvider'");
            }

            @Override
            public <T extends Provider> T getComponentProvider(Class<T> clazz, String componentId) {
                throw new UnsupportedOperationException("Unimplemented method 'getComponentProvider'");
            }

            @Override
            public <T extends Provider> T getComponentProvider(Class<T> clazz, String componentId,
                    Function<KeycloakSessionFactory, ComponentModel> modelGetter) {
                throw new UnsupportedOperationException("Unimplemented method 'getComponentProvider'");
            }

            @Override
            @Deprecated
            public <T extends Provider> T getProvider(Class<T> clazz, ComponentModel componentModel) {
                throw new UnsupportedOperationException("Unimplemented method 'getProvider'");
            }

            @Override
            public <T extends Provider> Set<String> listProviderIds(Class<T> clazz) {
                throw new UnsupportedOperationException("Unimplemented method 'listProviderIds'");
            }

            @Override
            public <T extends Provider> Set<T> getAllProviders(Class<T> clazz) {
                throw new UnsupportedOperationException("Unimplemented method 'getAllProviders'");
            }

            @Override
            public Class<? extends Provider> getProviderClass(String providerClassName) {
                throw new UnsupportedOperationException("Unimplemented method 'getProviderClass'");
            }

            @Override
            public Object getAttribute(String attribute) {
                throw new UnsupportedOperationException("Unimplemented method 'getAttribute'");
            }

            @Override
            public <T> T getAttribute(String attribute, Class<T> clazz) {
                throw new UnsupportedOperationException("Unimplemented method 'getAttribute'");
            }

            @Override
            public Object removeAttribute(String attribute) {
                throw new UnsupportedOperationException("Unimplemented method 'removeAttribute'");
            }

            @Override
            public void setAttribute(String name, Object value) {
                throw new UnsupportedOperationException("Unimplemented method 'setAttribute'");
            }

            @Override
            public Map<String, Object> getAttributes() {
                throw new UnsupportedOperationException("Unimplemented method 'getAttributes'");
            }

            @Override
            public void invalidate(InvalidableObjectType type, Object... params) {
                throw new UnsupportedOperationException("Unimplemented method 'invalidate'");
            }

            @Override
            public void enlistForClose(Provider provider) {
                throw new UnsupportedOperationException("Unimplemented method 'enlistForClose'");
            }

            @Override
            public KeycloakSessionFactory getKeycloakSessionFactory() {
                throw new UnsupportedOperationException("Unimplemented method 'getKeycloakSessionFactory'");
            }

            @Override
            public RealmProvider realms() {
                final RealmModel theRealm = new RealmModel() {

                    @Override
                    public RoleModel getRole(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'getRole'");
                    }

                    @Override
                    public RoleModel addRole(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'addRole'");
                    }

                    @Override
                    public RoleModel addRole(final String id, final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'addRole'");
                    }

                    @Override
                    public boolean removeRole(final RoleModel role) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeRole'");
                    }

                    @Override
                    public Stream<RoleModel> getRolesStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getRolesStream'");
                    }

                    @Override
                    public Stream<RoleModel> getRolesStream(final Integer firstResult, final Integer maxResults) {
                        throw new UnsupportedOperationException("Unimplemented method 'getRolesStream'");
                    }

                    @Override
                    public Stream<RoleModel> searchForRolesStream(final String search, final Integer first,
                            final Integer max) {
                        throw new UnsupportedOperationException("Unimplemented method 'searchForRolesStream'");
                    }

                    @Override
                    public String getId() {
                        return "open-products-facts";
                    }

                    @Override
                    public String getName() {
                        return "open-products-facts";
                    }

                    @Override
                    public void setName(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'setName'");
                    }

                    @Override
                    public String getDisplayName() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDisplayName'");
                    }

                    @Override
                    public void setDisplayName(final String displayName) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDisplayName'");
                    }

                    @Override
                    public String getDisplayNameHtml() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDisplayNameHtml'");
                    }

                    @Override
                    public void setDisplayNameHtml(final String displayNameHtml) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDisplayNameHtml'");
                    }

                    @Override
                    public boolean isEnabled() {
                        throw new UnsupportedOperationException("Unimplemented method 'isEnabled'");
                    }

                    @Override
                    public void setEnabled(final boolean enabled) {
                        throw new UnsupportedOperationException("Unimplemented method 'setEnabled'");
                    }

                    @Override
                    public SslRequired getSslRequired() {
                        throw new UnsupportedOperationException("Unimplemented method 'getSslRequired'");
                    }

                    @Override
                    public void setSslRequired(final SslRequired sslRequired) {
                        throw new UnsupportedOperationException("Unimplemented method 'setSslRequired'");
                    }

                    @Override
                    public boolean isRegistrationAllowed() {
                        throw new UnsupportedOperationException("Unimplemented method 'isRegistrationAllowed'");
                    }

                    @Override
                    public void setRegistrationAllowed(final boolean registrationAllowed) {
                        throw new UnsupportedOperationException("Unimplemented method 'setRegistrationAllowed'");
                    }

                    @Override
                    public boolean isRegistrationEmailAsUsername() {
                        throw new UnsupportedOperationException("Unimplemented method 'isRegistrationEmailAsUsername'");
                    }

                    @Override
                    public void setRegistrationEmailAsUsername(final boolean registrationEmailAsUsername) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setRegistrationEmailAsUsername'");
                    }

                    @Override
                    public boolean isRememberMe() {
                        throw new UnsupportedOperationException("Unimplemented method 'isRememberMe'");
                    }

                    @Override
                    public void setRememberMe(final boolean rememberMe) {
                        throw new UnsupportedOperationException("Unimplemented method 'setRememberMe'");
                    }

                    @Override
                    public boolean isEditUsernameAllowed() {
                        throw new UnsupportedOperationException("Unimplemented method 'isEditUsernameAllowed'");
                    }

                    @Override
                    public void setEditUsernameAllowed(final boolean editUsernameAllowed) {
                        throw new UnsupportedOperationException("Unimplemented method 'setEditUsernameAllowed'");
                    }

                    @Override
                    public boolean isUserManagedAccessAllowed() {
                        throw new UnsupportedOperationException("Unimplemented method 'isUserManagedAccessAllowed'");
                    }

                    @Override
                    public void setUserManagedAccessAllowed(final boolean userManagedAccessAllowed) {
                        throw new UnsupportedOperationException("Unimplemented method 'setUserManagedAccessAllowed'");
                    }

                    @Override
                    public void setAttribute(final String name, final String value) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAttribute'");
                    }

                    @Override
                    public void removeAttribute(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeAttribute'");
                    }

                    @Override
                    public String getAttribute(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'getAttribute'");
                    }

                    @Override
                    public Map<String, String> getAttributes() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAttributes'");
                    }

                    @Override
                    public boolean isBruteForceProtected() {
                        throw new UnsupportedOperationException("Unimplemented method 'isBruteForceProtected'");
                    }

                    @Override
                    public void setBruteForceProtected(final boolean value) {
                        throw new UnsupportedOperationException("Unimplemented method 'setBruteForceProtected'");
                    }

                    @Override
                    public boolean isPermanentLockout() {
                        throw new UnsupportedOperationException("Unimplemented method 'isPermanentLockout'");
                    }

                    @Override
                    public void setPermanentLockout(final boolean val) {
                        throw new UnsupportedOperationException("Unimplemented method 'setPermanentLockout'");
                    }

                    @Override
                    public int getMaxFailureWaitSeconds() {
                        throw new UnsupportedOperationException("Unimplemented method 'getMaxFailureWaitSeconds'");
                    }

                    @Override
                    public void setMaxFailureWaitSeconds(final int val) {
                        throw new UnsupportedOperationException("Unimplemented method 'setMaxFailureWaitSeconds'");
                    }

                    @Override
                    public int getWaitIncrementSeconds() {
                        throw new UnsupportedOperationException("Unimplemented method 'getWaitIncrementSeconds'");
                    }

                    @Override
                    public void setWaitIncrementSeconds(final int val) {
                        throw new UnsupportedOperationException("Unimplemented method 'setWaitIncrementSeconds'");
                    }

                    @Override
                    public int getMinimumQuickLoginWaitSeconds() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getMinimumQuickLoginWaitSeconds'");
                    }

                    @Override
                    public void setMinimumQuickLoginWaitSeconds(final int val) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setMinimumQuickLoginWaitSeconds'");
                    }

                    @Override
                    public long getQuickLoginCheckMilliSeconds() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getQuickLoginCheckMilliSeconds'");
                    }

                    @Override
                    public void setQuickLoginCheckMilliSeconds(final long val) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setQuickLoginCheckMilliSeconds'");
                    }

                    @Override
                    public int getMaxDeltaTimeSeconds() {
                        throw new UnsupportedOperationException("Unimplemented method 'getMaxDeltaTimeSeconds'");
                    }

                    @Override
                    public void setMaxDeltaTimeSeconds(final int val) {
                        throw new UnsupportedOperationException("Unimplemented method 'setMaxDeltaTimeSeconds'");
                    }

                    @Override
                    public int getFailureFactor() {
                        throw new UnsupportedOperationException("Unimplemented method 'getFailureFactor'");
                    }

                    @Override
                    public void setFailureFactor(final int failureFactor) {
                        throw new UnsupportedOperationException("Unimplemented method 'setFailureFactor'");
                    }

                    @Override
                    public boolean isVerifyEmail() {
                        return isVerifyEmail;
                    }

                    @Override
                    public void setVerifyEmail(final boolean verifyEmail) {
                        throw new UnsupportedOperationException("Unimplemented method 'setVerifyEmail'");
                    }

                    @Override
                    public boolean isLoginWithEmailAllowed() {
                        throw new UnsupportedOperationException("Unimplemented method 'isLoginWithEmailAllowed'");
                    }

                    @Override
                    public void setLoginWithEmailAllowed(final boolean loginWithEmailAllowed) {
                        throw new UnsupportedOperationException("Unimplemented method 'setLoginWithEmailAllowed'");
                    }

                    @Override
                    public boolean isDuplicateEmailsAllowed() {
                        throw new UnsupportedOperationException("Unimplemented method 'isDuplicateEmailsAllowed'");
                    }

                    @Override
                    public void setDuplicateEmailsAllowed(final boolean duplicateEmailsAllowed) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDuplicateEmailsAllowed'");
                    }

                    @Override
                    public boolean isResetPasswordAllowed() {
                        throw new UnsupportedOperationException("Unimplemented method 'isResetPasswordAllowed'");
                    }

                    @Override
                    public void setResetPasswordAllowed(final boolean resetPasswordAllowed) {
                        throw new UnsupportedOperationException("Unimplemented method 'setResetPasswordAllowed'");
                    }

                    @Override
                    public String getDefaultSignatureAlgorithm() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDefaultSignatureAlgorithm'");
                    }

                    @Override
                    public void setDefaultSignatureAlgorithm(final String defaultSignatureAlgorithm) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDefaultSignatureAlgorithm'");
                    }

                    @Override
                    public boolean isRevokeRefreshToken() {
                        throw new UnsupportedOperationException("Unimplemented method 'isRevokeRefreshToken'");
                    }

                    @Override
                    public void setRevokeRefreshToken(final boolean revokeRefreshToken) {
                        throw new UnsupportedOperationException("Unimplemented method 'setRevokeRefreshToken'");
                    }

                    @Override
                    public int getRefreshTokenMaxReuse() {
                        throw new UnsupportedOperationException("Unimplemented method 'getRefreshTokenMaxReuse'");
                    }

                    @Override
                    public void setRefreshTokenMaxReuse(final int revokeRefreshTokenCount) {
                        throw new UnsupportedOperationException("Unimplemented method 'setRefreshTokenMaxReuse'");
                    }

                    @Override
                    public int getSsoSessionIdleTimeout() {
                        throw new UnsupportedOperationException("Unimplemented method 'getSsoSessionIdleTimeout'");
                    }

                    @Override
                    public void setSsoSessionIdleTimeout(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setSsoSessionIdleTimeout'");
                    }

                    @Override
                    public int getSsoSessionMaxLifespan() {
                        throw new UnsupportedOperationException("Unimplemented method 'getSsoSessionMaxLifespan'");
                    }

                    @Override
                    public void setSsoSessionMaxLifespan(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setSsoSessionMaxLifespan'");
                    }

                    @Override
                    public int getSsoSessionIdleTimeoutRememberMe() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getSsoSessionIdleTimeoutRememberMe'");
                    }

                    @Override
                    public void setSsoSessionIdleTimeoutRememberMe(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setSsoSessionIdleTimeoutRememberMe'");
                    }

                    @Override
                    public int getSsoSessionMaxLifespanRememberMe() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getSsoSessionMaxLifespanRememberMe'");
                    }

                    @Override
                    public void setSsoSessionMaxLifespanRememberMe(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setSsoSessionMaxLifespanRememberMe'");
                    }

                    @Override
                    public int getOfflineSessionIdleTimeout() {
                        throw new UnsupportedOperationException("Unimplemented method 'getOfflineSessionIdleTimeout'");
                    }

                    @Override
                    public void setOfflineSessionIdleTimeout(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setOfflineSessionIdleTimeout'");
                    }

                    @Override
                    public int getAccessTokenLifespan() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAccessTokenLifespan'");
                    }

                    @Override
                    public boolean isOfflineSessionMaxLifespanEnabled() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'isOfflineSessionMaxLifespanEnabled'");
                    }

                    @Override
                    public void setOfflineSessionMaxLifespanEnabled(final boolean offlineSessionMaxLifespanEnabled) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setOfflineSessionMaxLifespanEnabled'");
                    }

                    @Override
                    public int getOfflineSessionMaxLifespan() {
                        throw new UnsupportedOperationException("Unimplemented method 'getOfflineSessionMaxLifespan'");
                    }

                    @Override
                    public void setOfflineSessionMaxLifespan(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setOfflineSessionMaxLifespan'");
                    }

                    @Override
                    public int getClientSessionIdleTimeout() {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientSessionIdleTimeout'");
                    }

                    @Override
                    public void setClientSessionIdleTimeout(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setClientSessionIdleTimeout'");
                    }

                    @Override
                    public int getClientSessionMaxLifespan() {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientSessionMaxLifespan'");
                    }

                    @Override
                    public void setClientSessionMaxLifespan(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setClientSessionMaxLifespan'");
                    }

                    @Override
                    public int getClientOfflineSessionIdleTimeout() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getClientOfflineSessionIdleTimeout'");
                    }

                    @Override
                    public void setClientOfflineSessionIdleTimeout(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setClientOfflineSessionIdleTimeout'");
                    }

                    @Override
                    public int getClientOfflineSessionMaxLifespan() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getClientOfflineSessionMaxLifespan'");
                    }

                    @Override
                    public void setClientOfflineSessionMaxLifespan(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setClientOfflineSessionMaxLifespan'");
                    }

                    @Override
                    public void setAccessTokenLifespan(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAccessTokenLifespan'");
                    }

                    @Override
                    public int getAccessTokenLifespanForImplicitFlow() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getAccessTokenLifespanForImplicitFlow'");
                    }

                    @Override
                    public void setAccessTokenLifespanForImplicitFlow(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setAccessTokenLifespanForImplicitFlow'");
                    }

                    @Override
                    public int getAccessCodeLifespan() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAccessCodeLifespan'");
                    }

                    @Override
                    public void setAccessCodeLifespan(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAccessCodeLifespan'");
                    }

                    @Override
                    public int getAccessCodeLifespanUserAction() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getAccessCodeLifespanUserAction'");
                    }

                    @Override
                    public void setAccessCodeLifespanUserAction(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setAccessCodeLifespanUserAction'");
                    }

                    @Override
                    public OAuth2DeviceConfig getOAuth2DeviceConfig() {
                        throw new UnsupportedOperationException("Unimplemented method 'getOAuth2DeviceConfig'");
                    }

                    @Override
                    public CibaConfig getCibaPolicy() {
                        throw new UnsupportedOperationException("Unimplemented method 'getCibaPolicy'");
                    }

                    @Override
                    public ParConfig getParPolicy() {
                        throw new UnsupportedOperationException("Unimplemented method 'getParPolicy'");
                    }

                    @Override
                    public Map<String, Integer> getUserActionTokenLifespans() {
                        throw new UnsupportedOperationException("Unimplemented method 'getUserActionTokenLifespans'");
                    }

                    @Override
                    public int getAccessCodeLifespanLogin() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAccessCodeLifespanLogin'");
                    }

                    @Override
                    public void setAccessCodeLifespanLogin(final int seconds) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAccessCodeLifespanLogin'");
                    }

                    @Override
                    public int getActionTokenGeneratedByAdminLifespan() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getActionTokenGeneratedByAdminLifespan'");
                    }

                    @Override
                    public void setActionTokenGeneratedByAdminLifespan(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setActionTokenGeneratedByAdminLifespan'");
                    }

                    @Override
                    public int getActionTokenGeneratedByUserLifespan() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getActionTokenGeneratedByUserLifespan'");
                    }

                    @Override
                    public void setActionTokenGeneratedByUserLifespan(final int seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setActionTokenGeneratedByUserLifespan'");
                    }

                    @Override
                    public int getActionTokenGeneratedByUserLifespan(final String actionTokenType) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getActionTokenGeneratedByUserLifespan'");
                    }

                    @Override
                    public void setActionTokenGeneratedByUserLifespan(final String actionTokenType,
                            final Integer seconds) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setActionTokenGeneratedByUserLifespan'");
                    }

                    @Override
                    public Stream<RequiredCredentialModel> getRequiredCredentialsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getRequiredCredentialsStream'");
                    }

                    @Override
                    public void addRequiredCredential(final String cred) {
                        throw new UnsupportedOperationException("Unimplemented method 'addRequiredCredential'");
                    }

                    @Override
                    public PasswordPolicy getPasswordPolicy() {
                        throw new UnsupportedOperationException("Unimplemented method 'getPasswordPolicy'");
                    }

                    @Override
                    public void setPasswordPolicy(final PasswordPolicy policy) {
                        throw new UnsupportedOperationException("Unimplemented method 'setPasswordPolicy'");
                    }

                    @Override
                    public OTPPolicy getOTPPolicy() {
                        throw new UnsupportedOperationException("Unimplemented method 'getOTPPolicy'");
                    }

                    @Override
                    public void setOTPPolicy(final OTPPolicy policy) {
                        throw new UnsupportedOperationException("Unimplemented method 'setOTPPolicy'");
                    }

                    @Override
                    public WebAuthnPolicy getWebAuthnPolicy() {
                        throw new UnsupportedOperationException("Unimplemented method 'getWebAuthnPolicy'");
                    }

                    @Override
                    public void setWebAuthnPolicy(final WebAuthnPolicy policy) {
                        throw new UnsupportedOperationException("Unimplemented method 'setWebAuthnPolicy'");
                    }

                    @Override
                    public WebAuthnPolicy getWebAuthnPolicyPasswordless() {
                        throw new UnsupportedOperationException("Unimplemented method 'getWebAuthnPolicyPasswordless'");
                    }

                    @Override
                    public void setWebAuthnPolicyPasswordless(final WebAuthnPolicy policy) {
                        throw new UnsupportedOperationException("Unimplemented method 'setWebAuthnPolicyPasswordless'");
                    }

                    @Override
                    public RoleModel getRoleById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getRoleById'");
                    }

                    @Override
                    public Stream<GroupModel> getDefaultGroupsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDefaultGroupsStream'");
                    }

                    @Override
                    public void addDefaultGroup(final GroupModel group) {
                        throw new UnsupportedOperationException("Unimplemented method 'addDefaultGroup'");
                    }

                    @Override
                    public void removeDefaultGroup(final GroupModel group) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeDefaultGroup'");
                    }

                    @Override
                    public Stream<ClientModel> getClientsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientsStream'");
                    }

                    @Override
                    public Stream<ClientModel> getClientsStream(final Integer firstResult, final Integer maxResults) {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientsStream'");
                    }

                    @Override
                    public Long getClientsCount() {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientsCount'");
                    }

                    @Override
                    public Stream<ClientModel> getAlwaysDisplayInConsoleClientsStream() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getAlwaysDisplayInConsoleClientsStream'");
                    }

                    @Override
                    public ClientModel addClient(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'addClient'");
                    }

                    @Override
                    public ClientModel addClient(final String id, final String clientId) {
                        throw new UnsupportedOperationException("Unimplemented method 'addClient'");
                    }

                    @Override
                    public boolean removeClient(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeClient'");
                    }

                    @Override
                    public ClientModel getClientById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientById'");
                    }

                    @Override
                    public ClientModel getClientByClientId(final String clientId) {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientByClientId'");
                    }

                    @Override
                    public Stream<ClientModel> searchClientByClientIdStream(final String clientId,
                            final Integer firstResult,
                            final Integer maxResults) {
                        throw new UnsupportedOperationException("Unimplemented method 'searchClientByClientIdStream'");
                    }

                    @Override
                    public Stream<ClientModel> searchClientByAttributes(final Map<String, String> attributes,
                            final Integer firstResult, final Integer maxResults) {
                        throw new UnsupportedOperationException("Unimplemented method 'searchClientByAttributes'");
                    }

                    @Override
                    public Stream<ClientModel> searchClientByAuthenticationFlowBindingOverrides(
                            final Map<String, String> overrides, final Integer firstResult, final Integer maxResults) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'searchClientByAuthenticationFlowBindingOverrides'");
                    }

                    @Override
                    public void updateRequiredCredentials(final Set<String> creds) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateRequiredCredentials'");
                    }

                    @Override
                    public Map<String, String> getBrowserSecurityHeaders() {
                        throw new UnsupportedOperationException("Unimplemented method 'getBrowserSecurityHeaders'");
                    }

                    @Override
                    public void setBrowserSecurityHeaders(final Map<String, String> headers) {
                        throw new UnsupportedOperationException("Unimplemented method 'setBrowserSecurityHeaders'");
                    }

                    @Override
                    public Map<String, String> getSmtpConfig() {
                        throw new UnsupportedOperationException("Unimplemented method 'getSmtpConfig'");
                    }

                    @Override
                    public void setSmtpConfig(final Map<String, String> smtpConfig) {
                        throw new UnsupportedOperationException("Unimplemented method 'setSmtpConfig'");
                    }

                    @Override
                    public AuthenticationFlowModel getBrowserFlow() {
                        throw new UnsupportedOperationException("Unimplemented method 'getBrowserFlow'");
                    }

                    @Override
                    public void setBrowserFlow(final AuthenticationFlowModel flow) {
                        throw new UnsupportedOperationException("Unimplemented method 'setBrowserFlow'");
                    }

                    @Override
                    public AuthenticationFlowModel getRegistrationFlow() {
                        throw new UnsupportedOperationException("Unimplemented method 'getRegistrationFlow'");
                    }

                    @Override
                    public void setRegistrationFlow(final AuthenticationFlowModel flow) {
                        throw new UnsupportedOperationException("Unimplemented method 'setRegistrationFlow'");
                    }

                    @Override
                    public AuthenticationFlowModel getDirectGrantFlow() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDirectGrantFlow'");
                    }

                    @Override
                    public void setDirectGrantFlow(final AuthenticationFlowModel flow) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDirectGrantFlow'");
                    }

                    @Override
                    public AuthenticationFlowModel getResetCredentialsFlow() {
                        throw new UnsupportedOperationException("Unimplemented method 'getResetCredentialsFlow'");
                    }

                    @Override
                    public void setResetCredentialsFlow(final AuthenticationFlowModel flow) {
                        throw new UnsupportedOperationException("Unimplemented method 'setResetCredentialsFlow'");
                    }

                    @Override
                    public AuthenticationFlowModel getClientAuthenticationFlow() {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientAuthenticationFlow'");
                    }

                    @Override
                    public void setClientAuthenticationFlow(final AuthenticationFlowModel flow) {
                        throw new UnsupportedOperationException("Unimplemented method 'setClientAuthenticationFlow'");
                    }

                    @Override
                    public AuthenticationFlowModel getDockerAuthenticationFlow() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDockerAuthenticationFlow'");
                    }

                    @Override
                    public void setDockerAuthenticationFlow(final AuthenticationFlowModel flow) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDockerAuthenticationFlow'");
                    }

                    @Override
                    public Stream<AuthenticationFlowModel> getAuthenticationFlowsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAuthenticationFlowsStream'");
                    }

                    @Override
                    public AuthenticationFlowModel getFlowByAlias(final String alias) {
                        throw new UnsupportedOperationException("Unimplemented method 'getFlowByAlias'");
                    }

                    @Override
                    public AuthenticationFlowModel addAuthenticationFlow(final AuthenticationFlowModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'addAuthenticationFlow'");
                    }

                    @Override
                    public AuthenticationFlowModel getAuthenticationFlowById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getAuthenticationFlowById'");
                    }

                    @Override
                    public void removeAuthenticationFlow(final AuthenticationFlowModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeAuthenticationFlow'");
                    }

                    @Override
                    public void updateAuthenticationFlow(final AuthenticationFlowModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateAuthenticationFlow'");
                    }

                    @Override
                    public Stream<AuthenticationExecutionModel> getAuthenticationExecutionsStream(final String flowId) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getAuthenticationExecutionsStream'");
                    }

                    @Override
                    public AuthenticationExecutionModel getAuthenticationExecutionById(final String id) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getAuthenticationExecutionById'");
                    }

                    @Override
                    public AuthenticationExecutionModel getAuthenticationExecutionByFlowId(final String flowId) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getAuthenticationExecutionByFlowId'");
                    }

                    @Override
                    public AuthenticationExecutionModel addAuthenticatorExecution(
                            final AuthenticationExecutionModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'addAuthenticatorExecution'");
                    }

                    @Override
                    public void updateAuthenticatorExecution(final AuthenticationExecutionModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateAuthenticatorExecution'");
                    }

                    @Override
                    public void removeAuthenticatorExecution(final AuthenticationExecutionModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeAuthenticatorExecution'");
                    }

                    @Override
                    public Stream<AuthenticatorConfigModel> getAuthenticatorConfigsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAuthenticatorConfigsStream'");
                    }

                    @Override
                    public AuthenticatorConfigModel addAuthenticatorConfig(final AuthenticatorConfigModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'addAuthenticatorConfig'");
                    }

                    @Override
                    public void updateAuthenticatorConfig(final AuthenticatorConfigModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateAuthenticatorConfig'");
                    }

                    @Override
                    public void removeAuthenticatorConfig(final AuthenticatorConfigModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeAuthenticatorConfig'");
                    }

                    @Override
                    public AuthenticatorConfigModel getAuthenticatorConfigById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getAuthenticatorConfigById'");
                    }

                    @Override
                    public AuthenticatorConfigModel getAuthenticatorConfigByAlias(final String alias) {
                        throw new UnsupportedOperationException("Unimplemented method 'getAuthenticatorConfigByAlias'");
                    }

                    @Override
                    public Stream<RequiredActionProviderModel> getRequiredActionProvidersStream() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getRequiredActionProvidersStream'");
                    }

                    @Override
                    public RequiredActionProviderModel addRequiredActionProvider(
                            final RequiredActionProviderModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'addRequiredActionProvider'");
                    }

                    @Override
                    public void updateRequiredActionProvider(final RequiredActionProviderModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateRequiredActionProvider'");
                    }

                    @Override
                    public void removeRequiredActionProvider(final RequiredActionProviderModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeRequiredActionProvider'");
                    }

                    @Override
                    public RequiredActionProviderModel getRequiredActionProviderById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getRequiredActionProviderById'");
                    }

                    @Override
                    public RequiredActionProviderModel getRequiredActionProviderByAlias(final String alias) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getRequiredActionProviderByAlias'");
                    }

                    @Override
                    @Deprecated
                    public Stream<IdentityProviderModel> getIdentityProvidersStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getIdentityProvidersStream'");
                    }

                    @Override
                    @Deprecated
                    public IdentityProviderModel getIdentityProviderByAlias(final String alias) {
                        throw new UnsupportedOperationException("Unimplemented method 'getIdentityProviderByAlias'");
                    }

                    @Override
                    @Deprecated
                    public void addIdentityProvider(final IdentityProviderModel identityProvider) {
                        throw new UnsupportedOperationException("Unimplemented method 'addIdentityProvider'");
                    }

                    @Override
                    @Deprecated
                    public void removeIdentityProviderByAlias(final String alias) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeIdentityProviderByAlias'");
                    }

                    @Override
                    @Deprecated
                    public void updateIdentityProvider(final IdentityProviderModel identityProvider) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateIdentityProvider'");
                    }

                    @Override
                    @Deprecated
                    public Stream<IdentityProviderMapperModel> getIdentityProviderMappersStream() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getIdentityProviderMappersStream'");
                    }

                    @Override
                    @Deprecated
                    public Stream<IdentityProviderMapperModel> getIdentityProviderMappersByAliasStream(
                            final String brokerAlias) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getIdentityProviderMappersByAliasStream'");
                    }

                    @Override
                    @Deprecated
                    public IdentityProviderMapperModel addIdentityProviderMapper(
                            final IdentityProviderMapperModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'addIdentityProviderMapper'");
                    }

                    @Override
                    @Deprecated
                    public void removeIdentityProviderMapper(final IdentityProviderMapperModel mapping) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeIdentityProviderMapper'");
                    }

                    @Override
                    @Deprecated
                    public void updateIdentityProviderMapper(final IdentityProviderMapperModel mapping) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateIdentityProviderMapper'");
                    }

                    @Override
                    @Deprecated
                    public IdentityProviderMapperModel getIdentityProviderMapperById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getIdentityProviderMapperById'");
                    }

                    @Override
                    @Deprecated
                    public IdentityProviderMapperModel getIdentityProviderMapperByName(final String brokerAlias,
                            final String name) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getIdentityProviderMapperByName'");
                    }

                    @Override
                    public ComponentModel addComponentModel(final ComponentModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'addComponentModel'");
                    }

                    @Override
                    public ComponentModel importComponentModel(final ComponentModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'importComponentModel'");
                    }

                    @Override
                    public void updateComponent(final ComponentModel component) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateComponent'");
                    }

                    @Override
                    public void removeComponent(final ComponentModel component) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeComponent'");
                    }

                    @Override
                    public void removeComponents(final String parentId) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeComponents'");
                    }

                    @Override
                    public Stream<ComponentModel> getComponentsStream(final String parentId,
                            final String providerType) {
                        throw new UnsupportedOperationException("Unimplemented method 'getComponentsStream'");
                    }

                    @Override
                    public Stream<ComponentModel> getComponentsStream(final String parentId) {
                        throw new UnsupportedOperationException("Unimplemented method 'getComponentsStream'");
                    }

                    @Override
                    public Stream<ComponentModel> getComponentsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getComponentsStream'");
                    }

                    @Override
                    public ComponentModel getComponent(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getComponent'");
                    }

                    @Override
                    public String getLoginTheme() {
                        throw new UnsupportedOperationException("Unimplemented method 'getLoginTheme'");
                    }

                    @Override
                    public void setLoginTheme(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'setLoginTheme'");
                    }

                    @Override
                    public String getAccountTheme() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAccountTheme'");
                    }

                    @Override
                    public void setAccountTheme(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAccountTheme'");
                    }

                    @Override
                    public String getAdminTheme() {
                        throw new UnsupportedOperationException("Unimplemented method 'getAdminTheme'");
                    }

                    @Override
                    public void setAdminTheme(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAdminTheme'");
                    }

                    @Override
                    public String getEmailTheme() {
                        throw new UnsupportedOperationException("Unimplemented method 'getEmailTheme'");
                    }

                    @Override
                    public void setEmailTheme(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'setEmailTheme'");
                    }

                    @Override
                    public int getNotBefore() {
                        throw new UnsupportedOperationException("Unimplemented method 'getNotBefore'");
                    }

                    @Override
                    public void setNotBefore(final int notBefore) {
                        throw new UnsupportedOperationException("Unimplemented method 'setNotBefore'");
                    }

                    @Override
                    public boolean isEventsEnabled() {
                        throw new UnsupportedOperationException("Unimplemented method 'isEventsEnabled'");
                    }

                    @Override
                    public void setEventsEnabled(final boolean enabled) {
                        throw new UnsupportedOperationException("Unimplemented method 'setEventsEnabled'");
                    }

                    @Override
                    public long getEventsExpiration() {
                        throw new UnsupportedOperationException("Unimplemented method 'getEventsExpiration'");
                    }

                    @Override
                    public void setEventsExpiration(final long expiration) {
                        throw new UnsupportedOperationException("Unimplemented method 'setEventsExpiration'");
                    }

                    @Override
                    public Stream<String> getEventsListenersStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getEventsListenersStream'");
                    }

                    @Override
                    public void setEventsListeners(final Set<String> listeners) {
                        throw new UnsupportedOperationException("Unimplemented method 'setEventsListeners'");
                    }

                    @Override
                    public Stream<String> getEnabledEventTypesStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getEnabledEventTypesStream'");
                    }

                    @Override
                    public void setEnabledEventTypes(final Set<String> enabledEventTypes) {
                        throw new UnsupportedOperationException("Unimplemented method 'setEnabledEventTypes'");
                    }

                    @Override
                    public boolean isAdminEventsEnabled() {
                        throw new UnsupportedOperationException("Unimplemented method 'isAdminEventsEnabled'");
                    }

                    @Override
                    public void setAdminEventsEnabled(final boolean enabled) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAdminEventsEnabled'");
                    }

                    @Override
                    public boolean isAdminEventsDetailsEnabled() {
                        throw new UnsupportedOperationException("Unimplemented method 'isAdminEventsDetailsEnabled'");
                    }

                    @Override
                    public void setAdminEventsDetailsEnabled(final boolean enabled) {
                        throw new UnsupportedOperationException("Unimplemented method 'setAdminEventsDetailsEnabled'");
                    }

                    @Override
                    public ClientModel getMasterAdminClient() {
                        throw new UnsupportedOperationException("Unimplemented method 'getMasterAdminClient'");
                    }

                    @Override
                    public void setMasterAdminClient(final ClientModel client) {
                        throw new UnsupportedOperationException("Unimplemented method 'setMasterAdminClient'");
                    }

                    @Override
                    public RoleModel getDefaultRole() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDefaultRole'");
                    }

                    @Override
                    public void setDefaultRole(final RoleModel role) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDefaultRole'");
                    }

                    @Override
                    @Deprecated
                    public boolean isIdentityFederationEnabled() {
                        throw new UnsupportedOperationException("Unimplemented method 'isIdentityFederationEnabled'");
                    }

                    @Override
                    public boolean isInternationalizationEnabled() {
                        throw new UnsupportedOperationException("Unimplemented method 'isInternationalizationEnabled'");
                    }

                    @Override
                    public void setInternationalizationEnabled(final boolean enabled) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'setInternationalizationEnabled'");
                    }

                    @Override
                    public Stream<String> getSupportedLocalesStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getSupportedLocalesStream'");
                    }

                    @Override
                    public void setSupportedLocales(final Set<String> locales) {
                        throw new UnsupportedOperationException("Unimplemented method 'setSupportedLocales'");
                    }

                    @Override
                    public String getDefaultLocale() {
                        throw new UnsupportedOperationException("Unimplemented method 'getDefaultLocale'");
                    }

                    @Override
                    public void setDefaultLocale(final String locale) {
                        throw new UnsupportedOperationException("Unimplemented method 'setDefaultLocale'");
                    }

                    @Override
                    public GroupModel createGroup(final String id, final String name, final GroupModel toParent) {
                        throw new UnsupportedOperationException("Unimplemented method 'createGroup'");
                    }

                    @Override
                    public GroupModel getGroupById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getGroupById'");
                    }

                    @Override
                    public Stream<GroupModel> getGroupsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getGroupsStream'");
                    }

                    @Override
                    public Long getGroupsCount(final Boolean onlyTopGroups) {
                        throw new UnsupportedOperationException("Unimplemented method 'getGroupsCount'");
                    }

                    @Override
                    public Long getGroupsCountByNameContaining(final String search) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getGroupsCountByNameContaining'");
                    }

                    @Override
                    @Deprecated
                    public Stream<GroupModel> getTopLevelGroupsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getTopLevelGroupsStream'");
                    }

                    @Override
                    @Deprecated
                    public Stream<GroupModel> getTopLevelGroupsStream(final Integer first, final Integer max) {
                        throw new UnsupportedOperationException("Unimplemented method 'getTopLevelGroupsStream'");
                    }

                    @Override
                    public boolean removeGroup(final GroupModel group) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeGroup'");
                    }

                    @Override
                    public void moveGroup(final GroupModel group, final GroupModel toParent) {
                        throw new UnsupportedOperationException("Unimplemented method 'moveGroup'");
                    }

                    @Override
                    public Stream<ClientScopeModel> getClientScopesStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientScopesStream'");
                    }

                    @Override
                    public ClientScopeModel addClientScope(final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'addClientScope'");
                    }

                    @Override
                    public ClientScopeModel addClientScope(final String id, final String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'addClientScope'");
                    }

                    @Override
                    public boolean removeClientScope(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeClientScope'");
                    }

                    @Override
                    public ClientScopeModel getClientScopeById(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientScopeById'");
                    }

                    @Override
                    public void addDefaultClientScope(final ClientScopeModel clientScope, final boolean defaultScope) {
                        throw new UnsupportedOperationException("Unimplemented method 'addDefaultClientScope'");
                    }

                    @Override
                    public void removeDefaultClientScope(final ClientScopeModel clientScope) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeDefaultClientScope'");
                    }

                    @Override
                    public void createOrUpdateRealmLocalizationTexts(final String locale,
                            final Map<String, String> localizationTexts) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'createOrUpdateRealmLocalizationTexts'");
                    }

                    @Override
                    public boolean removeRealmLocalizationTexts(final String locale) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeRealmLocalizationTexts'");
                    }

                    @Override
                    public Map<String, Map<String, String>> getRealmLocalizationTexts() {
                        throw new UnsupportedOperationException("Unimplemented method 'getRealmLocalizationTexts'");
                    }

                    @Override
                    public Map<String, String> getRealmLocalizationTextsByLocale(final String locale) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getRealmLocalizationTextsByLocale'");
                    }

                    @Override
                    public Stream<ClientScopeModel> getDefaultClientScopesStream(final boolean defaultScope) {
                        throw new UnsupportedOperationException("Unimplemented method 'getDefaultClientScopesStream'");
                    }

                    @Override
                    public ClientInitialAccessModel createClientInitialAccessModel(final int expiration,
                            final int count) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'createClientInitialAccessModel'");
                    }

                    @Override
                    public ClientInitialAccessModel getClientInitialAccessModel(final String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientInitialAccessModel'");
                    }

                    @Override
                    public void removeClientInitialAccessModel(final String id) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'removeClientInitialAccessModel'");
                    }

                    @Override
                    public Stream<ClientInitialAccessModel> getClientInitialAccesses() {
                        throw new UnsupportedOperationException("Unimplemented method 'getClientInitialAccesses'");
                    }

                    @Override
                    public void decreaseRemainingCount(final ClientInitialAccessModel clientInitialAccess) {
                        throw new UnsupportedOperationException("Unimplemented method 'decreaseRemainingCount'");
                    }

                    @Override
                    public AuthenticationFlowModel getFirstBrokerLoginFlow() {
                        throw new UnsupportedOperationException("Unimplemented method 'getFirstBrokerLoginFlow'");
                    }

                    @Override
                    public int getMaxTemporaryLockouts() {
                        throw new UnsupportedOperationException("Unimplemented method 'getMaxTemporaryLockouts'");
                    }

                    @Override
                    public void setFirstBrokerLoginFlow(final AuthenticationFlowModel arg0) {
                        throw new UnsupportedOperationException("Unimplemented method 'setFirstBrokerLoginFlow'");
                    }

                    @Override
                    public void setMaxTemporaryLockouts(final int arg0) {
                        throw new UnsupportedOperationException("Unimplemented method 'setMaxTemporaryLockouts'");
                    }

                    @Override
                    public boolean isOrganizationsEnabled() {
                        throw new UnsupportedOperationException("Unimplemented method 'isOrganizationsEnabled'");
                    }

                    @Override
                    public void setOrganizationsEnabled(boolean organizationsEnabled) {
                        throw new UnsupportedOperationException("Unimplemented method 'setOrganizationsEnabled'");
                    }

                    @Override
                    public RequiredActionConfigModel getRequiredActionConfigById(String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'getRequiredActionConfigById'");
                    }

                    @Override
                    public RequiredActionConfigModel getRequiredActionConfigByAlias(String alias) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getRequiredActionConfigByAlias'");
                    }

                    @Override
                    public void removeRequiredActionProviderConfig(RequiredActionConfigModel model) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'removeRequiredActionProviderConfig'");
                    }

                    @Override
                    public void updateRequiredActionConfig(RequiredActionConfigModel model) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateRequiredActionConfig'");
                    }

                    @Override
                    public Stream<RequiredActionConfigModel> getRequiredActionConfigsStream() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getRequiredActionConfigsStream'");
                    }

                    @Override
                    public BruteForceStrategy getBruteForceStrategy() {
                        throw new UnsupportedOperationException("Unimplemented method 'getBruteForceStrategy'");
                    }

                    @Override
                    public void setBruteForceStrategy(BruteForceStrategy arg0) {
                        throw new UnsupportedOperationException("Unimplemented method 'setBruteForceStrategy'");
                    }

                    @Override
                    public boolean isAdminPermissionsEnabled() {
                        // TODO Auto-generated method stub
                        throw new UnsupportedOperationException("Unimplemented method 'isAdminPermissionsEnabled'");
                    }

                    @Override
                    public void setAdminPermissionsEnabled(boolean adminPermissionsEnabled) {
                        // TODO Auto-generated method stub
                        throw new UnsupportedOperationException("Unimplemented method 'setAdminPermissionsEnabled'");
                    }

                    @Override
                    public boolean isVerifiableCredentialsEnabled() {
                        // TODO Auto-generated method stub
                        throw new UnsupportedOperationException("Unimplemented method 'isVerifiableCredentialsEnabled'");
                    }

                    @Override
                    public void setVerifiableCredentialsEnabled(boolean verifiableCredentialsEnabled) {
                        // TODO Auto-generated method stub
                        throw new UnsupportedOperationException("Unimplemented method 'setVerifiableCredentialsEnabled'");
                    }

                    @Override
                    public ClientModel getAdminPermissionsClient() {
                        // TODO Auto-generated method stub
                        throw new UnsupportedOperationException("Unimplemented method 'getAdminPermissionsClient'");
                    }

                    @Override
                    public void setAdminPermissionsClient(ClientModel client) {
                        // TODO Auto-generated method stub
                        throw new UnsupportedOperationException("Unimplemented method 'setAdminPermissionsClient'");
                    }

                };

                return new RealmProvider() {

                    @Override
                    public void close() {
                        throw new UnsupportedOperationException("Unimplemented method 'close'");
                    }

                    @Override
                    public RealmModel createRealm(String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'createRealm'");
                    }

                    @Override
                    public RealmModel createRealm(String id, String name) {
                        throw new UnsupportedOperationException("Unimplemented method 'createRealm'");
                    }

                    @Override
                    public RealmModel getRealm(String id) {
                        if (id != null && theRealm.getId().equals(id)) {
                            return theRealm;
                        }

                        return null;
                    }

                    @Override
                    public RealmModel getRealmByName(String name) {
                        if (name != null && theRealm.getName().equals(name)) {
                            return theRealm;
                        }

                        return null;
                    }

                    @Override
                    public Stream<RealmModel> getRealmsStream() {
                        throw new UnsupportedOperationException("Unimplemented method 'getRealmsStream'");
                    }

                    @Override
                    public Stream<RealmModel> getRealmsWithProviderTypeStream(Class<?> type) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'getRealmsWithProviderTypeStream'");
                    }

                    @Override
                    public boolean removeRealm(String id) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeRealm'");
                    }

                    @Override
                    public void removeExpiredClientInitialAccess() {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'removeExpiredClientInitialAccess'");
                    }

                    @Override
                    public void saveLocalizationText(RealmModel realm, String locale, String key, String text) {
                        throw new UnsupportedOperationException("Unimplemented method 'saveLocalizationText'");
                    }

                    @Override
                    public void saveLocalizationTexts(RealmModel realm, String locale,
                            Map<String, String> localizationTexts) {
                        throw new UnsupportedOperationException("Unimplemented method 'saveLocalizationTexts'");
                    }

                    @Override
                    public boolean updateLocalizationText(RealmModel realm, String locale, String key, String text) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateLocalizationText'");
                    }

                    @Override
                    public boolean deleteLocalizationTextsByLocale(RealmModel realm, String locale) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'deleteLocalizationTextsByLocale'");
                    }

                    @Override
                    public boolean deleteLocalizationText(RealmModel realm, String locale, String key) {
                        throw new UnsupportedOperationException("Unimplemented method 'deleteLocalizationText'");
                    }

                    @Override
                    public String getLocalizationTextsById(RealmModel realm, String locale, String key) {
                        throw new UnsupportedOperationException("Unimplemented method 'getLocalizationTextsById'");
                    }

                };
            }

            @Override
            public ClientProvider clients() {
                throw new UnsupportedOperationException("Unimplemented method 'clients'");
            }

            @Override
            public ClientScopeProvider clientScopes() {
                throw new UnsupportedOperationException("Unimplemented method 'clientScopes'");
            }

            @Override
            public GroupProvider groups() {
                throw new UnsupportedOperationException("Unimplemented method 'groups'");
            }

            @Override
            public RoleProvider roles() {
                throw new UnsupportedOperationException("Unimplemented method 'roles'");
            }

            @Override
            public UserSessionProvider sessions() {
                throw new UnsupportedOperationException("Unimplemented method 'sessions'");
            }

            @Override
            public UserLoginFailureProvider loginFailures() {
                throw new UnsupportedOperationException("Unimplemented method 'loginFailures'");
            }

            @Override
            public AuthenticationSessionProvider authenticationSessions() {
                throw new UnsupportedOperationException("Unimplemented method 'authenticationSessions'");
            }

            @Override
            public SingleUseObjectProvider singleUseObjects() {
                throw new UnsupportedOperationException("Unimplemented method 'singleUseObjects'");
            }

            @Override
            public void close() {
                throw new UnsupportedOperationException("Unimplemented method 'close'");
            }

            @Override
            public UserProvider users() {
                return new UserProvider() {

                    private String registeredAttribute = initialRegisteredAttribute;

                    @Override
                    public void close() {
                        throw new UnsupportedOperationException("Unimplemented method 'close'");
                    }

                    @Override
                    public UserModel getUserById(RealmModel realm, String id) {
                        if (realm != null && realm.getId().equals("open-products-facts") && id != null
                                && "theUserId".equals(id)) {
                            return new UserModel() {

                                @Override
                                public Stream<RoleModel> getRealmRoleMappingsStream() {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'getRealmRoleMappingsStream'");
                                }

                                @Override
                                public Stream<RoleModel> getClientRoleMappingsStream(ClientModel app) {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'getClientRoleMappingsStream'");
                                }

                                @Override
                                public boolean hasRole(RoleModel role) {
                                    throw new UnsupportedOperationException("Unimplemented method 'hasRole'");
                                }

                                @Override
                                public void grantRole(RoleModel role) {
                                    throw new UnsupportedOperationException("Unimplemented method 'grantRole'");
                                }

                                @Override
                                public Stream<RoleModel> getRoleMappingsStream() {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'getRoleMappingsStream'");
                                }

                                @Override
                                public void deleteRoleMapping(RoleModel role) {
                                    throw new UnsupportedOperationException("Unimplemented method 'deleteRoleMapping'");
                                }

                                @Override
                                public String getId() {
                                    return "theUserId";
                                }

                                @Override
                                public String getUsername() {
                                    return "theUserName";
                                }

                                @Override
                                public void setUsername(String username) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setUsername'");
                                }

                                @Override
                                public Long getCreatedTimestamp() {
                                    return Time.currentTimeMillis();
                                }

                                @Override
                                public void setCreatedTimestamp(Long timestamp) {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'setCreatedTimestamp'");
                                }

                                @Override
                                public boolean isEnabled() {
                                    throw new UnsupportedOperationException("Unimplemented method 'isEnabled'");
                                }

                                @Override
                                public void setEnabled(boolean enabled) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setEnabled'");
                                }

                                @Override
                                public void setSingleAttribute(String name, String value) {
                                    if ("registered".equals(name)) {
                                        registeredAttribute = value;
                                        return;
                                    }

                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'setSingleAttribute'");
                                }

                                @Override
                                public void setAttribute(String name, List<String> values) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setAttribute'");
                                }

                                @Override
                                public void removeAttribute(String name) {
                                    throw new UnsupportedOperationException("Unimplemented method 'removeAttribute'");
                                }

                                @Override
                                public String getFirstAttribute(String name) {
                                    if ("newsletter".equals(name)) {
                                        return userNewsletterAttribute;
                                    } else if ("registered".equals(name)) {
                                        return registeredAttribute;
                                    }

                                    return null;
                                }

                                @Override
                                public Stream<String> getAttributeStream(String name) {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'getAttributeStream'");
                                }

                                @Override
                                public Map<String, List<String>> getAttributes() {
                                    throw new UnsupportedOperationException("Unimplemented method 'getAttributes'");
                                }

                                @Override
                                public Stream<String> getRequiredActionsStream() {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'getRequiredActionsStream'");
                                }

                                @Override
                                public void addRequiredAction(String action) {
                                    throw new UnsupportedOperationException("Unimplemented method 'addRequiredAction'");
                                }

                                @Override
                                public void removeRequiredAction(String action) {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'removeRequiredAction'");
                                }

                                @Override
                                public String getFirstName() {
                                    throw new UnsupportedOperationException("Unimplemented method 'getFirstName'");
                                }

                                @Override
                                public void setFirstName(String firstName) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setFirstName'");
                                }

                                @Override
                                public String getLastName() {
                                    throw new UnsupportedOperationException("Unimplemented method 'getLastName'");
                                }

                                @Override
                                public void setLastName(String lastName) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setLastName'");
                                }

                                @Override
                                public String getEmail() {
                                    return "someUser@example.org";
                                }

                                @Override
                                public void setEmail(String email) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setEmail'");
                                }

                                @Override
                                public boolean isEmailVerified() {
                                    return isEmailVerified;
                                }

                                @Override
                                public void setEmailVerified(boolean verified) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setEmailVerified'");
                                }

                                @Override
                                public Stream<GroupModel> getGroupsStream() {
                                    throw new UnsupportedOperationException("Unimplemented method 'getGroupsStream'");
                                }

                                @Override
                                public void joinGroup(GroupModel group) {
                                    throw new UnsupportedOperationException("Unimplemented method 'joinGroup'");
                                }

                                @Override
                                public void leaveGroup(GroupModel group) {
                                    throw new UnsupportedOperationException("Unimplemented method 'leaveGroup'");
                                }

                                @Override
                                public boolean isMemberOf(GroupModel group) {
                                    throw new UnsupportedOperationException("Unimplemented method 'isMemberOf'");
                                }

                                @Override
                                public String getFederationLink() {
                                    throw new UnsupportedOperationException("Unimplemented method 'getFederationLink'");
                                }

                                @Override
                                public void setFederationLink(String link) {
                                    throw new UnsupportedOperationException("Unimplemented method 'setFederationLink'");
                                }

                                @Override
                                public String getServiceAccountClientLink() {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'getServiceAccountClientLink'");
                                }

                                @Override
                                public void setServiceAccountClientLink(String clientInternalId) {
                                    throw new UnsupportedOperationException(
                                            "Unimplemented method 'setServiceAccountClientLink'");
                                }

                                @Override
                                public SubjectCredentialManager credentialManager() {
                                    throw new UnsupportedOperationException("Unimplemented method 'credentialManager'");
                                }

                            };
                        }

                        return null;
                    }

                    @Override
                    public UserModel getUserByUsername(RealmModel realm, String username) {
                        throw new UnsupportedOperationException("Unimplemented method 'getUserByUsername'");
                    }

                    @Override
                    public UserModel getUserByEmail(RealmModel realm, String email) {
                        throw new UnsupportedOperationException("Unimplemented method 'getUserByEmail'");
                    }

                    @Override
                    public Stream<UserModel> searchForUserStream(RealmModel realm, Map<String, String> params,
                            Integer firstResult, Integer maxResults) {
                        throw new UnsupportedOperationException("Unimplemented method 'searchForUserStream'");
                    }

                    @Override
                    public Stream<UserModel> getGroupMembersStream(RealmModel realm, GroupModel group,
                            Integer firstResult, Integer maxResults) {
                        throw new UnsupportedOperationException("Unimplemented method 'getGroupMembersStream'");
                    }

                    @Override
                    public Stream<UserModel> searchForUserByUserAttributeStream(RealmModel realm, String attrName,
                            String attrValue) {
                        throw new UnsupportedOperationException(
                                "Unimplemented method 'searchForUserByUserAttributeStream'");
                    }

                    @Override
                    public UserModel addUser(RealmModel realm, String username) {
                        throw new UnsupportedOperationException("Unimplemented method 'addUser'");
                    }

                    @Override
                    public boolean removeUser(RealmModel realm, UserModel user) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeUser'");
                    }

                    @Override
                    public void grantToAllUsers(RealmModel realm, RoleModel role) {
                        throw new UnsupportedOperationException("Unimplemented method 'grantToAllUsers'");
                    }

                    @Override
                    public void setNotBeforeForUser(RealmModel realm, UserModel user, int notBefore) {
                        throw new UnsupportedOperationException("Unimplemented method 'setNotBeforeForUser'");
                    }

                    @Override
                    public int getNotBeforeOfUser(RealmModel realm, UserModel user) {
                        throw new UnsupportedOperationException("Unimplemented method 'getNotBeforeOfUser'");
                    }

                    @Override
                    public UserModel getServiceAccount(ClientModel client) {
                        throw new UnsupportedOperationException("Unimplemented method 'getServiceAccount'");
                    }

                    @Override
                    public UserModel addUser(RealmModel realm, String id, String username, boolean addDefaultRoles,
                            boolean addDefaultRequiredActions) {
                        throw new UnsupportedOperationException("Unimplemented method 'addUser'");
                    }

                    @Override
                    public void removeImportedUsers(RealmModel realm, String storageProviderId) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeImportedUsers'");
                    }

                    @Override
                    public void unlinkUsers(RealmModel realm, String storageProviderId) {
                        throw new UnsupportedOperationException("Unimplemented method 'unlinkUsers'");
                    }

                    @Override
                    public void addConsent(RealmModel realm, String userId, UserConsentModel consent) {
                        throw new UnsupportedOperationException("Unimplemented method 'addConsent'");
                    }

                    @Override
                    public UserConsentModel getConsentByClient(RealmModel realm, String userId,
                            String clientInternalId) {
                        throw new UnsupportedOperationException("Unimplemented method 'getConsentByClient'");
                    }

                    @Override
                    public Stream<UserConsentModel> getConsentsStream(RealmModel realm, String userId) {
                        throw new UnsupportedOperationException("Unimplemented method 'getConsentsStream'");
                    }

                    @Override
                    public void updateConsent(RealmModel realm, String userId, UserConsentModel consent) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateConsent'");
                    }

                    @Override
                    public boolean revokeConsentForClient(RealmModel realm, String userId, String clientInternalId) {
                        throw new UnsupportedOperationException("Unimplemented method 'revokeConsentForClient'");
                    }

                    @Override
                    public void addFederatedIdentity(RealmModel realm, UserModel user,
                            FederatedIdentityModel socialLink) {
                        throw new UnsupportedOperationException("Unimplemented method 'addFederatedIdentity'");
                    }

                    @Override
                    public boolean removeFederatedIdentity(RealmModel realm, UserModel user, String socialProvider) {
                        throw new UnsupportedOperationException("Unimplemented method 'removeFederatedIdentity'");
                    }

                    @Override
                    public void updateFederatedIdentity(RealmModel realm, UserModel federatedUser,
                            FederatedIdentityModel federatedIdentityModel) {
                        throw new UnsupportedOperationException("Unimplemented method 'updateFederatedIdentity'");
                    }

                    @Override
                    public Stream<FederatedIdentityModel> getFederatedIdentitiesStream(RealmModel realm,
                            UserModel user) {
                        throw new UnsupportedOperationException("Unimplemented method 'getFederatedIdentitiesStream'");
                    }

                    @Override
                    public FederatedIdentityModel getFederatedIdentity(RealmModel realm, UserModel user,
                            String socialProvider) {
                        throw new UnsupportedOperationException("Unimplemented method 'getFederatedIdentity'");
                    }

                    @Override
                    public UserModel getUserByFederatedIdentity(RealmModel realm, FederatedIdentityModel socialLink) {
                        throw new UnsupportedOperationException("Unimplemented method 'getUserByFederatedIdentity'");
                    }

                    @Override
                    public void preRemove(RealmModel realm) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                    @Override
                    public void preRemove(RealmModel realm, IdentityProviderModel provider) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                    @Override
                    public void preRemove(RealmModel realm, RoleModel role) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                    @Override
                    public void preRemove(RealmModel realm, GroupModel group) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                    @Override
                    public void preRemove(RealmModel realm, ClientModel client) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                    @Override
                    public void preRemove(ProtocolMapperModel protocolMapper) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                    @Override
                    public void preRemove(ClientScopeModel clientScope) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                    @Override
                    public void preRemove(RealmModel realm, ComponentModel component) {
                        throw new UnsupportedOperationException("Unimplemented method 'preRemove'");
                    }

                };
            }

            @Override
            public KeyManager keys() {
                throw new UnsupportedOperationException("Unimplemented method 'keys'");
            }

            @Override
            public ThemeManager theme() {
                throw new UnsupportedOperationException("Unimplemented method 'theme'");
            }

            @Override
            public TokenManager tokens() {
                throw new UnsupportedOperationException("Unimplemented method 'tokens'");
            }

            @Override
            public VaultTranscriber vault() {
                throw new UnsupportedOperationException("Unimplemented method 'vault'");
            }

            @Override
            public ClientPolicyManager clientPolicy() {
                throw new UnsupportedOperationException("Unimplemented method 'clientPolicy'");
            }

            @Override
            public boolean isClosed() {
                throw new UnsupportedOperationException("Unimplemented method 'isClosed'");
            }

            @Override
            public IdentityProviderStorageProvider identityProviders() {
                throw new UnsupportedOperationException("Unimplemented method 'identityProviders'");
            }

        };
    }

    public static KeycloakSessionFactory createKeycloakSessionFactory() {
        return createKeycloakSessionFactory(true, false, null);
    }

    public static KeycloakSessionFactory createKeycloakSessionFactory(final boolean isVerifyEmail,
            final boolean isEmailVerified) {
        return createKeycloakSessionFactory(isVerifyEmail, isEmailVerified, null);
    }

    public static KeycloakSessionFactory createKeycloakSessionFactory(final boolean isVerifyEmail,
            final boolean isEmailVerified, final String userNewsletterAttribute) {
        return createKeycloakSessionFactory(isVerifyEmail, isEmailVerified, userNewsletterAttribute, null);
    }

    public static KeycloakSessionFactory createKeycloakSessionFactory(final boolean isVerifyEmail,
            final boolean isEmailVerified, final String userNewsletterAttribute, final String registeredAttribute) {
        return new KeycloakSessionFactory() {
            private ProviderEventListener listener;

            @Override
            public void register(ProviderEventListener listener) {
                this.listener = listener;
            }

            @Override
            public void unregister(ProviderEventListener listener) {
                if (this.listener == listener) {
                    this.listener = null;
                }
            }

            @Override
            public void publish(ProviderEvent event) {
                if (this.listener != null) {
                    this.listener.onEvent(event);
                }
            }

            @Override
            public void invalidate(KeycloakSession session, InvalidableObjectType type, Object... params) {
                throw new UnsupportedOperationException("Unimplemented method 'invalidate'");
            }

            @Override
            public KeycloakSession create() {
                return createKeycloakSession(isVerifyEmail, isEmailVerified, userNewsletterAttribute,
                        registeredAttribute);
            }

            @Override
            public Set<Spi> getSpis() {
                throw new UnsupportedOperationException("Unimplemented method 'getSpis'");
            }

            @Override
            public Spi getSpi(Class<? extends Provider> providerClass) {
                throw new UnsupportedOperationException("Unimplemented method 'getSpi'");
            }

            @Override
            public <T extends Provider> ProviderFactory<T> getProviderFactory(Class<T> clazz) {
                throw new UnsupportedOperationException("Unimplemented method 'getProviderFactory'");
            }

            @Override
            public <T extends Provider> ProviderFactory<T> getProviderFactory(Class<T> clazz, String id) {
                throw new UnsupportedOperationException("Unimplemented method 'getProviderFactory'");
            }

            @Override
            public <T extends Provider> ProviderFactory<T> getProviderFactory(Class<T> clazz, String realmId,
                    String componentId, Function<KeycloakSessionFactory, ComponentModel> modelGetter) {
                throw new UnsupportedOperationException("Unimplemented method 'getProviderFactory'");
            }

            @SuppressWarnings("rawtypes")
            @Override
            public Stream<ProviderFactory> getProviderFactoriesStream(Class<? extends Provider> clazz) {
                throw new UnsupportedOperationException("Unimplemented method 'getProviderFactoriesStream'");
            }

            @Override
            public long getServerStartupTimestamp() {
                throw new UnsupportedOperationException("Unimplemented method 'getServerStartupTimestamp'");
            }

            @Override
            public void close() {
                throw new UnsupportedOperationException("Unimplemented method 'close'");
            }

        };
    }
}
