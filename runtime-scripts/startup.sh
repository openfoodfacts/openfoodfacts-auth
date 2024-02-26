# Running configuration after startup inspired by: https://keycloak.discourse.group/t/keycloak-x-docker-startup-scripts-not-being-executed/8208/6?u=famod
echo "*** Starting background process ***"
sh /opt/keycloak/after_startup.sh &
echo "*** Starting keycloak ***"
# TODO: Remove "dev"
/opt/keycloak/bin/kc.sh start-dev --import-realm --features="account3,declarative-user-profile"

