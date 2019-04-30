import { ConnectionOptions } from "typeorm";
import path from "path";

export interface MakeTypeormConfigArg {
  DATABASE_URL?: string;
  JS?: string | boolean;
  SYNC?: string;
  DROP_SCHEMA?: string;
  LOG?: string | boolean;
}

export function makeTypeormConfig({
  DATABASE_URL,
  JS,
  SYNC,
  DROP_SCHEMA,
  LOG
}: MakeTypeormConfigArg = {}) {
  const js = JS === "true" || JS === true || process.env.JS === "true";

  const root = js ? "dist" : "src";

  const fileSuffix = js ? "js" : "ts";

  return {
    type: "postgres",
    url: DATABASE_URL || process.env.DATABASE_URL,
    logging: !!(LOG || process.env.LOG),
    synchronize: !!(SYNC || process.env.SYNC),
    dropSchema: !!(DROP_SCHEMA || process.env.DROP_SCHEMA),
    entities: [root + "/entity/**/*." + fileSuffix],
    migrations: [root + "/migration/**/*." + fileSuffix],
    subscribers: [root + "/subscriber/**/*." + fileSuffix],
    cli: {
      entitiesDir: root + "/entity",
      migrationsDir: root + "/migration",
      subscribersDir: root + "/subscriber"
    }
  } as ConnectionOptions;
}

export function getTypeormConfigForConnection({
  DATABASE_URL,
  JS,
  SYNC,
  DROP_SCHEMA,
  LOG
}: MakeTypeormConfigArg = {}) {
  const js = JS === "true" || JS === true || process.env.JS === "true";

  const root = path.resolve(__dirname, "..", js ? "dist" : "src");

  const fileSuffix = js ? "js" : "ts";

  return {
    type: "postgres",
    url: DATABASE_URL || process.env.DATABASE_URL,
    logging: !!(LOG || process.env.LOG),
    synchronize: !!(SYNC || process.env.SYNC),
    dropSchema: !!(DROP_SCHEMA || process.env.DROP_SCHEMA),
    entities: [root + "/entity/**/*." + fileSuffix],
    migrations: [root + "/migration/**/*." + fileSuffix],
    subscribers: [root + "/subscriber/**/*." + fileSuffix],
    cli: {
      entitiesDir: root + "/entity",
      migrationsDir: root + "/migration",
      subscribersDir: root + "/subscriber"
    }
  } as ConnectionOptions;
}
