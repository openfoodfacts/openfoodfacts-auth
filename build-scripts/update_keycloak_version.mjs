import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { Parser, Builder } from 'xml2js'

const pomFile = 'pom.xml';
const dockerFile = 'Dockerfile';
const pom = await new Parser().parseStringPromise(readFileSync(pomFile, 'utf-8'));
const keycloak_version = pom.project.properties[0]['keycloak.version'][0];
const project_version = pom.project.version[0]
if (keycloak_version !== project_version) {
    pom.project.version = keycloak_version;
    pom.project.properties[0].revision = keycloak_version;
    writeFileSync(pomFile, (new Builder()).buildObject(pom));

    var dockerContent = readFileSync(dockerFile, 'utf-8');
    writeFileSync(dockerFile, dockerContent.replace(/FROM quay\.io\/keycloak\/keycloak\:.* AS base/, `FROM quay.io/keycloak/keycloak:${keycloak_version} AS base`))
    execSync(`make refresh_themes KEYCLOAK_VERSION=${keycloak_version}`);
}

