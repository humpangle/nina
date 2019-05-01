import { ConnectionOptions } from "typeorm";
import path from "path";

export function makeTypeormConfig() {
  const js = process.env.JS === "true";

  const root = js ? "dist" : "src";

  const fileSuffix = js ? "js" : "ts";

  return {
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: !!process.env.LOG,
    synchronize: !!process.env.SYNC,
    dropSchema: !!process.env.DROP_SCHEMA,
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

export function getTypeormConfigForConnection() {
  const js = process.env.JS === "true";

  const root = path.resolve(__dirname, "..", js ? "dist" : "src");

  const fileSuffix = js ? "js" : "ts";

  return {
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: !!process.env.LOG,
    synchronize: !!process.env.SYNC,
    dropSchema: !!process.env.DROP_SCHEMA,
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
