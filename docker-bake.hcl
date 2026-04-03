variable "REGISTRY" {
  default = "ghcr.io"
}

variable "IMAGE_NAME" {
  default = "openfoodfacts/openfoodfacts-auth"
}

variable "IMAGE_TAG" {
  default = "latest"
}

variable "PLATFORMS" {
  default = "linux/amd64,linux/arm64"
}

variable "BUILDCACHE_TAG" {
  default = "buildcache"
}

variable "BUILDCACHE_TESTCONTAINER_TAG" {
  default = "buildcache-testcontainer"
}

// Shared settings for all targets
target "_common" {
  context = "."
  dockerfile = "Dockerfile"
}

// Dev image - amd64 only for faster local testing
target "dev" {
  inherits = ["_common"]
  platforms = ["linux/amd64"]
  tags = ["${REGISTRY}/${IMAGE_NAME}:dev"]
  output = ["type=docker"]
  cache-from = ["type=registry,ref=${REGISTRY}/${IMAGE_NAME}:${BUILDCACHE_TAG}"]
  cache-to = ["type=registry,ref=${REGISTRY}/${IMAGE_NAME}:${BUILDCACHE_TAG},mode=max"]
}

// Regular production image - multi-platform with metadata
target "regular" {
  inherits = ["_common"]
  platforms = split(",", PLATFORMS)
  tags = [
    "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}",
    "${REGISTRY}/${IMAGE_NAME}:latest"
  ]
  cache-from = ["type=registry,ref=${REGISTRY}/${IMAGE_NAME}:${BUILDCACHE_TAG}"]
  cache-to = ["type=registry,ref=${REGISTRY}/${IMAGE_NAME}:${BUILDCACHE_TAG},mode=max"]
}

// Testcontainer for integration testing - multi-platform
target "testcontainer" {
  inherits = ["_common"]
  target = "testcontainer"
  platforms = split(",", PLATFORMS)
  tags = ["${REGISTRY}/${IMAGE_NAME}:testcontainer"]
  cache-from = ["type=registry,ref=${REGISTRY}/${IMAGE_NAME}:${BUILDCACHE_TESTCONTAINER_TAG}"]
  cache-to = ["type=registry,ref=${REGISTRY}/${IMAGE_NAME}:${BUILDCACHE_TESTCONTAINER_TAG},mode=max"]
  labels = {
    "org.opencontainers.image.version" = "testcontainer"
    "org.opencontainers.image.description" = "Keycloak Image for integration testing using a pre-loaded realm and test clients in a dev-file database"
  }
}

// Build groups
group "default" {
  targets = ["dev"]
}

group "all" {
  targets = ["dev", "regular", "testcontainer"]
}

group "push" {
  targets = ["regular", "testcontainer"]
}
