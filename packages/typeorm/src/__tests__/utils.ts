import { createConnection } from "typeorm";

import { CreateUserDbInput } from "../context/user";
import { makeTypeormConfig } from "../make-ormconfig";

export const USER_CREATION_ARGS: CreateUserDbInput = {
  username: "john",
  email: "a@b.com",
  encryptedToken: "12345"
};

export function connectToDb() {
  return createConnection(makeTypeormConfig());
}
