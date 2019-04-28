import { Connection } from "typeorm";

import { createUser, login } from "../context/user";
import { USER_CREATION_ARGS, connectToDb } from "./utils";
import { Credential, User } from "@nina/common";

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
    expect((user.credential as Credential).encryptedToken).toBeNull();
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
      username: "john"
    });

    /**
     * Then we should get saved user
     */
    expect((user as User).username).toBe("john");
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
      email: "a@b.com"
    });

    /**
     * Then we should get saved user
     */
    expect((user as User).email).toBe("a@b.com");
  });

  it("succeeds with both username and email", async () => {
    /**
     * Given a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

    /**
     * When we login with both username and email
     */
    const user = await login(connection, {
      username: USER_CREATION_ARGS.username,
      email: USER_CREATION_ARGS.email
    });

    /**
     * Then we should get saved user
     */
    expect((user as User).username).toBe(USER_CREATION_ARGS.username);
  });

  it("returns null if no username or password supplied", async () => {
    /**
     * When we login without username or password
     * then we should get an error
     */

    const result = await login(connection, {});

    expect(result).toBeNull();
  });

  it("returns null if username or email not found in the database", async () => {
    const index = Math.round(Math.random());

    /**
     * When we login with non existing username/email
     * Then we should get an error
     */
    const result = await login(connection, {
      ...wrongData[index]
    });

    expect(result).toBeNull();
  });

  it("returns null if one of username or email is wrong", async () => {
    /**
     * Given a user exists in the system
     */
    await createUser(connection, USER_CREATION_ARGS);

    const index = Math.round(Math.random());

    /**
     * When we login with both username and email, but one of these is wrong,
     * then we should get an error
     */
    const result = await login(connection, {
      username: "john",
      email: "a@b.com",
      ...wrongData[index]
    });

    expect(result).toBeNull();
  });
});
