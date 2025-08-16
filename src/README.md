# Keycloak extensions

## Keycloak scrypt

This is a password hash provider for Keycloak 20+ to support scrypt hashes which allows us to migrate existing users to Keycloak without them having to change their password.

This is a fork of [dreezey/argon2-password-hash-provider](https://github.com/dreezey/argon2-password-hash-provider) updated to work with mainline Keycloak and use scrypt instead.

The [original README is here](README.original.md). 

## Event listener providers

These forward relevant Keycloak events to Redis so that other services, like Product Opener, can take appropriate actions. The following events are currently generated:

### user-registered

This is emitted when a new user has been created and has validated their email address. Note that email address validation is not currently enforced when new users are created via the mobile app.

### user-deleted

This is emitted when a user deletes their account. Product Opener uses this event to anonymise contributions made by this user.

# Development

A JDK is required along with Maven. The versions should match the builder image used in the `Dockerfile`, e.g.

```Dockerfile
FROM maven:3-eclipse-temurin-21 AS builder
```

Uses Maven version 3 with version 21 of the JDK.

Note that if the `keycloak.version` property is changed you will need to run `make update_keycloak_version` to update the other version numbers in the `pom.xml` file and refresh themes and messages.

`make install` will download any other dependencies and run the unit tests.
