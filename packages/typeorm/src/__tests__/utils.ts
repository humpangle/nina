import { createConnection, ConnectionOptions } from "typeorm";

import { CreateUserDbInput } from "../context/user";

export const USER_CREATION_ARGS: CreateUserDbInput = {
  username: "john",
  email: "a@b.com",
  encryptedToken: "12345"
};

export function connectToDb() {
  return createConnection(require("../ormconfig.dev") as ConnectionOptions);
}
