import { Connection } from "typeorm";
import { UserInputError } from "apollo-server-core";

import {
  CreateUserInput,
  LoginInput,
  Credential,
  User,
  CreateUserValidator,
  makePasswordValidator,
  INVALID_INPUT_ERROR_TITLE,
  INVALID_LOGIN_INPUT_ERROR
} from "@nina/common";
import {
  dbCreateUser,
  dbLogin,
  dbGetUserById,
  dbGetUserByEmail,
  dbUpdateCredential
} from ".";
import { verifyHashSync, hashSync } from "./utils";
import { idToJwt, userFromJwt } from "./jwt";

export const getUserById = dbGetUserById;

export async function createUser(
  connection: Connection,
  input: CreateUserInput
): Promise<User> {
  try {
    CreateUserValidator.validateSync(input);
  } catch ({ errors }) {
    throw new UserInputError(INVALID_INPUT_ERROR_TITLE, { errors });
  }

  const { password, ...rest } = input;

  return await dbCreateUser(connection, {
    ...rest,
    encryptedToken: hashSync(password)
  });
}

export async function login(
  connection: Connection,
  { password, ...input }: LoginInput
) {
  if (!(input.email || input.username)) {
    throw new UserInputError(INVALID_LOGIN_INPUT_ERROR);
  }

  const user = await dbLogin(connection, input);

  if (!user) {
    throw new UserInputError(INVALID_LOGIN_INPUT_ERROR);
  }

  if (
    !verifyHashSync(password, (user.credential as Credential)
      .encryptedToken as string)
  ) {
    throw new UserInputError(INVALID_LOGIN_INPUT_ERROR);
  }

  return user;
}

const DEFAULT_PASSWORD_TOKEN_EXPIRATION = "24 hours";

export async function getPasswordRecoveryToken(
  connection: Connection,
  email: string,
  expiresIn: string = DEFAULT_PASSWORD_TOKEN_EXPIRATION
) {
  const user = await dbGetUserByEmail(connection, email);

  if (user) {
    return idToJwt(user.id, expiresIn);
  }

  return null;
}

export async function resetPassword(
  connection: Connection,
  { token, password }: { token: string; password: string }
) {
  try {
    makePasswordValidator().validateSync(password);
  } catch ({ errors }) {
    throw new UserInputError(INVALID_INPUT_ERROR_TITLE, { errors });
  }

  let user: User | undefined;

  try {
    user = await userFromJwt(connection, token);
  } catch (e) {
    return false;
  }

  if (!user) {
    return false;
  }

  return await dbUpdateCredential(
    connection,
    { user_id: user.id },
    { encryptedToken: hashSync(password) }
  );
}
