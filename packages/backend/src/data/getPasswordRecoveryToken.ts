import { Connection } from "typeorm";
import { UserInputError } from "apollo-server-core";

import { dbGetUserBy } from ".";
import { idToJwt } from "./jwt";
import {
  USER_DOES_NOT_EXIST_ERROR_TEXT,
  DEFAULT_PASSWORD_TOKEN_EXPIRATION
} from "./constants";

export async function getPasswordRecoveryToken(
  connection: Connection,
  email: string,
  expiresIn: string = DEFAULT_PASSWORD_TOKEN_EXPIRATION
) {
  const user = await dbGetUserBy(connection, { email });

  if (user) {
    return idToJwt(user.id, expiresIn);
  }

  throw new UserInputError(USER_DOES_NOT_EXIST_ERROR_TEXT);
}
