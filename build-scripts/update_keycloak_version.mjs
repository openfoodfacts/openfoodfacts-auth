import { readFileSync, writeFileSync } from "fs";
import { Parser, Builder } from 'xml2js'

const pomFile = 'pom.xml';
const version = process.env.KEYCLOAK_VERSION;
const pom = await new Parser().parseStringPromise(readFileSync(pomFile, 'utf-8'));
pom.project.version = version;
pom.project.properties[0].revision = version;
pom.project.properties[0]['keycloak.version'] = version;


writeFileSync(pomFile, (new Builder()).buildObject(pom));
