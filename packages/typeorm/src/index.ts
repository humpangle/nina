import { ConnectionOptions } from "typeorm";

export * from "./entity/user";
export * from "./entity/credential";
export * from "./context";

export interface MakeTypeormConfigArg {
  DATABASE_URL?: string;
  JS?: string | boolean;
  SYNC?: string;
  DROP_SCHEMA?: string;
  LOG?: string | boolean;
}

const { makeTypeormConfig: makeTypeormConfigFn } = require("./ormconfig");
export const makeTypeormConfig = makeTypeormConfigFn as (
  args?: MakeTypeormConfigArg
) => ConnectionOptions;
