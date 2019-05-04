import { Connection } from "typeorm";

import { createUser, login, resetPassword } from "../data/models";
import {
  PASSWORD_TOO_SHORT_ERROR,
  INVALID_LOGIN_INPUT_ERROR
} from "@nina/common";
import { USER_CREATION_ARGS, DB_USER_CREATION_ARGS } from "./utils";
import { idToJwt } from "../data/jwt";
import { getPasswordRecoveryToken } from "../data/getPasswordRecoveryToken";

jest.mock("@nina/typeorm/dist/context");

import {
  dbCreateUser,
  dbLogin,
  dbGetUserBy,
  dbUpdateCredential
} from "@nina/typeorm/dist/context";
import { hashSync } from "../data/utils";
import { USER_DOES_NOT_EXIST_ERROR_TEXT } from "../data/constants";

const mockDbCreateUser = dbCreateUser as jest.Mock;
const mockDbLogin = dbLogin as jest.Mock;
const mockDbGetUserBy = dbGetUserBy as jest.Mock;
const mockDbUpdateCredential = dbUpdateCredential as jest.Mock;

const connection = (jest.fn() as unknown) as Connection;

describe("user creation", () => {
  it("succeeds", async () => {
    mockDbCreateUser.mockResolvedValue({ id: 1 });
    /**
     * When we create a user
     */

    const user = await createUser(connection, USER_CREATION_ARGS);

    /**
     * Then created user's id should be defined
     */
    expect(user.id).toBeDefined();
  });

  it("fails due to validation error", () => {
    expect.assertions(1);

    /**
     * Given that user attempts to create user with wrong password length
     * Then user should see validation error
     */
    return createUser(connection, {
      username: "john",
      email: "a@b.com",
      password: "1234"
    }).catch(({ errors }) => {
      expect(errors[0]).toEqual(PASSWORD_TOO_SHORT_ERROR);
    });
  });

  it("fails due to database error", async () => {
    const message = '{"username":"already exists."}';
    mockDbCreateUser.mockRejectedValue({
      message
    });
    expect.assertions(1);

    /**
     * When we try to create user with the same username
     * Then user should see db error
     */
    return createUser(connection, USER_CREATION_ARGS).catch(error => {
      expect(error.message).toEqual(message);
    });
  });
});

describe("user login", () => {
  const resolvedUser = {
    id: 1,
    username: "john",
    email: "a@b.com",
    credential: { encryptedToken: DB_USER_CREATION_ARGS.encryptedToken }
  };

  it("succeeds with username only", async () => {
    mockDbLogin.mockResolvedValue(resolvedUser);
    /**
     * When we login with only username
     */
    const user = await login(connection, {
      username: "john",
      password: "12345"
    });

    /**
     * Then we should get saved user
     */
    expect(user.username).toBe("john");
  });

  it("succeeds with email only", async () => {
    mockDbLogin.mockResolvedValue(resolvedUser);

    /**
     * When we login with only email
     */
    const user = await login(connection, {
      email: "a@b.com",
      password: "12345"
    });

    /**
     * Then we should get saved user
     */
    expect(user.email).toBe("a@b.com");
  });

  it("succeeds with both username and email", async () => {
    mockDbLogin.mockResolvedValue(resolvedUser);

    /**
     * When we login with both username and email
     */
    const user = await login(connection, USER_CREATION_ARGS);

    /**
     * Then we should get saved user
     */
    expect(user.username).toBe(USER_CREATION_ARGS.username);
  });

  it("fails if no username or password supplied", async () => {
    expect.assertions(1);

    /**
     * When we login without username or password
     * then we should get an error
     */

    return login(connection, {
      password: "12345"
    }).catch(error => {
      expect(error.message).toEqual(INVALID_LOGIN_INPUT_ERROR);
    });
  });

  it("fails if wrong password provided", async () => {
    mockDbLogin.mockResolvedValue({
      credential: { encryptedToken: hashSync("1") }
    });
    expect.assertions(1);

    /**
     * When we login with wrong password,
     * then we should get an error
     */

    return login(connection, {
      username: "john",
      password: "123456"
    }).catch(error => {
      expect(error.message).toEqual(INVALID_LOGIN_INPUT_ERROR);
    });
  });

  it("fails if db returns null for user", async () => {
    mockDbLogin.mockResolvedValue(null);
    expect.assertions(1);

    /**
     * When we login with both username and email, but one of these is wrong,
     * then we should get an error
     */
    return login(connection, {
      username: "john",
      email: "a@b.com",
      password: "12345"
    }).catch(error => {
      expect(error.message).toEqual(INVALID_LOGIN_INPUT_ERROR);
    });
  });
});

describe("user password recovery", () => {
  it("gets recovery token successfully", async () => {
    mockDbGetUserBy.mockResolvedValue({ id: 1 });

    /**
     * When we ask for password recover token
     */
    const token = await getPasswordRecoveryToken(connection, "a@b.com");

    /**
     * Then token should exist
     */
    expect(token.length).toBeGreaterThan(2);
  });

  it("does not get a token because email not found in db", () => {
    expect.assertions(1);
    mockDbGetUserBy.mockResolvedValue(null);
    /**
     * Given we ask for password recovery token for a non existent email
     */
    return getPasswordRecoveryToken(connection, "a@b.com", "0.001").catch(
      error => {
        expect(error.message).toMatch(USER_DOES_NOT_EXIST_ERROR_TEXT);
      }
    );
  });

  it("resets password successfully", async () => {
    mockDbGetUserBy.mockResolvedValue({ id: 1 });
    mockDbGetUserBy.mockResolvedValue({ id: 1 });
    mockDbUpdateCredential.mockResolvedValue(true);

    /**
     * Given our request for password reset token was successful
     */
    const token = await getPasswordRecoveryToken(connection, "a@b.com");

    /**
     * When we request for password reset
     */
    const result = await resetPassword(connection, {
      token,
      password: "23456"
    });

    expect(result).toBe(true);
  });

  it("does not reset password because of wrong token", async () => {
    /**
     * When we request for password reset with non existent token
     */
    const result = await resetPassword(connection, {
      token: "does not exist",
      password: "does not matter"
    });

    /**
     * Then we should get false
     */
    expect(result).toBe(false);
  });

  it("does not reset password because token expires", async () => {
    mockDbGetUserBy.mockResolvedValue({ id: 1 });

    /**
     * Given our request for password reset token was successful
     */
    const token = await getPasswordRecoveryToken(connection, "a@b.com", "0.5");

    /**
     * When we request for password reset with expired token
     */
    const result = await resetPassword(connection, {
      token,
      password: "does not matter"
    });

    /**
     * Then we should get false
     */
    expect(result).toBe(false);
  });

  it("does not reset password because password is invalid", async () => {
    mockDbGetUserBy.mockResolvedValue({ id: 1 });

    expect.assertions(1);
    /**
     * Given our request for password reset token was successful
     */
    const token = await getPasswordRecoveryToken(connection, "a@b.com");

    /**
     * When we request for password reset with password that is too short
     * then we should get an error
     */

    return resetPassword(connection, {
      token,
      password: "1234" // too short
    }).catch(({ errors }) => {
      expect(errors[0]).toEqual(PASSWORD_TOO_SHORT_ERROR);
    });
  });

  it("does not reset password because user not found", async () => {
    mockDbGetUserBy.mockResolvedValue(null);

    /**
     * Given our request for password reset token was successful
     */

    //  is this not coupling the test to implementation details?
    const token = idToJwt(0); // user id 0 should never exist

    /**
     * When we request for password reset for a user that does not exist
     * then we should get false
     */

    const result = await resetPassword(connection, {
      token,
      password: "12345"
    });

    expect(result).toBe(false);
  });
});
