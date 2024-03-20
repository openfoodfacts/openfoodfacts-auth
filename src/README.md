# Keycloak extensions

## Keycloak scrypt

This is a password hash provider for Keycloak 20+ to support scrypt hashes.

This is a fork of [dreezey/argon2-password-hash-provider](https://github.com/dreezey/argon2-password-hash-provider) updated to work with mainline Keycloak and use scrypt instead.

The [original README is here](README.original.md). 

---

I has no long-term plan to support this fork; rather it's mainly a migration helper for a small subset of users in our systems using those systems.

However PRs etc are still welcome.

## Redis event listener providers

Forwards user deletion events to Redis.
