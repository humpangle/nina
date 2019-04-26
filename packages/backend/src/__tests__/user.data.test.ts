import { Connection } from "typeorm";

import {
  createUser,
  login,
  getPasswordRecoveryToken,
  resetPassword
} from "../data/models";
import {
  PASSWORD_TOO_SHORT_ERROR,
  INVALID_LOGIN_INPUT_ERROR
} from "@nina/common";
import { USER_CREATION_ARGS, connectToDb } from "./utils";
import { idToJwt } from "../data/jwt";

let connection: Connection;

beforeEach(async () => {
  connection = await connectToDb();
});

afterEach(() => {
  if (connection) {
    connection.close();
  }
});

describe("user creation", () => {
  it("succeeds", async () => {
    /**
     * When we create a user
     */

    const user = await createUser(connection, USER_CREATION_ARGS);

    /**
     * Then created user's id should be defined
     */
    expect(user.id).toBeDefined();

    /**
     * And created user's encrypted token should be null
     */
    expect(user.credential.encryptedToken).toBeNull();
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
    expect.assertions(1);

    /**
     * Given a user already exists
     */
    await createUser(connection, USER_CREATION_ARGS);

    /**
     * When we try to create user with the same username
     * Then user should see db error
     */
    return createUser(connection, USER_CREATION_ARGS).catch(error => {
      expect(error.message).toEqual('{"username":"already exists."}');
    });
  });
});

describe("user login", () => {
  const wrongData = [{ username: "john1" }, { email: "a1@b.com" }];

  it("succeeds with username only", async () => {
    /**
     * Given a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

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
    /**
     * Given a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

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
    /**
     * Given a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

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
    /**
     * Given a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

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

  it("fails if username or email not found in the database", async () => {
    const index = Math.round(Math.random());

    /**
     * When we login with non existing username/email
     * Then we should get an error
     */
    return login(connection, {
      ...wrongData[index],
      password: "12345"
    }).catch(error => {
      expect(error.message).toEqual(INVALID_LOGIN_INPUT_ERROR);
    });
  });

  it("fails if one of username or email is wrong", async () => {
    /**
     * Given a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

    const index = Math.round(Math.random());

    /**
     * When we login with both username and email, but one of these is wrong,
     * then we should get an error
     */
    return login(connection, {
      username: "john",
      email: "a@b.com",
      password: "12345",
      ...wrongData[index]
    }).catch(error => {
      expect(error.message).toEqual(INVALID_LOGIN_INPUT_ERROR);
    });
  });
});

describe("user password recovery", () => {
  it("gets recovery token successfully", async () => {
    /**
     * Given that a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

    /**
     * When we ask for password recover token
     */
    const token = await getPasswordRecoveryToken(connection, "a@b.com");

    /**
     * Then token should exist
     */
    expect(token.length).toBeGreaterThan(2);
  });

  it("does not get a token because email not found in db", async () => {
    /**
     * Given we ask for password recovery token for a non existent email
     */
    const token = await getPasswordRecoveryToken(connection, "a@b.com");
    /**
     * Then received token should not exist
     */
    expect(token).toBeNull();
  });

  it("resets password successfully", async () => {
    expect.assertions(3);
    /**
     * Given our request for password reset token was successful
     */
    const user1 = await createUser(connection, USER_CREATION_ARGS);
    const token = await getPasswordRecoveryToken(connection, "a@b.com");

    /**
     * When we request for password reset
     */
    const result = await resetPassword(connection, {
      token,
      password: "23456"
    });
    expect(result).toBe(true);

    /**
     * Then we should not be able to login with old password
     */
    try {
      await login(connection, { password: "12345", email: "a@b.com" });
    } catch (error) {
      expect(error.message).toEqual(INVALID_LOGIN_INPUT_ERROR);
    }

    /**
     * And we should be able to login with new password
     */
    const user2 = await login(connection, {
      password: "23456",
      email: "a@b.com"
    });
    expect(user1.id).toEqual(user2.id);
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
    /**
     * Given our request for password reset token was successful
     */
    await createUser(connection, USER_CREATION_ARGS);
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
    expect.assertions(1);
    /**
     * Given our request for password reset token was successful
     */
    await createUser(connection, USER_CREATION_ARGS);
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
