import { Connection } from "typeorm";

import {
  createUser,
  login,
  getUserBy,
  getCredentialRepo,
  updateCredential
} from "../context/user";
import { USER_CREATION_ARGS, connectToDb } from "./utils";
import { Credential, User } from "@nina/common";
import { makeAndWhere } from "../context/makeAndWhere";

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

describe("miscellaneous", () => {
  it("gets user by various columns", async () => {
    /**
     * Given a user exists in the system
     */

    const user = await createUser(connection, USER_CREATION_ARGS);

    /**
     * When we get the user by id
     */
    const gottenUser = (await getUserBy(connection, {
      id: user.id,
      email: user.email
    })) as User;

    /**
     * Then user Id should exist
     */
    expect(gottenUser.id).toBeDefined();

    /**
     * And created user's credential should exist
     */
    expect(user.credential).toBeTruthy();
  });

  it('makes "and where clause" without prefix ', () => {
    /**
     * Given an object
     */
    const args = { id: 1, email: 2 };

    /**
     * Then we should be able to turn it into "and where clause" without prefix
     */
    expect(makeAndWhere(args)).toEqual("id = :id AND email = :email");
  });

  it('makes "and where clause" with prefix ', () => {
    /**
     * Given an object
     */
    const args = { id: 1, email: 2 };

    /**
     * Then we should be able to turn it into "and where clause" with prefix
     */
    expect(makeAndWhere(args, "user")).toEqual(
      "user.id = :id AND user.email = :email"
    );
  });

  it('makes "and where clause" but removes keys with undefined values', () => {
    /**
     * Given an object
     */
    const args = { id: 1, email: undefined, password: undefined };

    /**
     * Then we should be able to turn it into "and where clause" without prefix
     */
    expect(makeAndWhere(args)).toEqual("id = :id");
  });

  it("updates credential successfully", async () => {
    /**
     * Given credential exists in the system
     */
    const user = await createUser(connection, USER_CREATION_ARGS);

    /**
     * When we compose a query to get the credential from database
     * through user id
     */
    const queryArgs = { user_id: user.id };
    const query = getCredentialRepo(connection)
      .createQueryBuilder("credential")
      .where(makeAndWhere(queryArgs, "credential"), queryArgs);

    /**
     * And we run the query
     */
    const credential = (await query.getOne()) as Credential;

    /**
     * Then queried credential's token should be the same as one with which
     * credential was created
     */
    expect(credential.encryptedToken).toEqual(
      USER_CREATION_ARGS.encryptedToken
    );

    /**
     * When we update the credential with new encrypted token
     */
    const updatedEncryptedToken = "534555";

    const result = await updateCredential(connection, queryArgs, {
      encryptedToken: updatedEncryptedToken
    });

    /**
     * Then the result should be true
     */
    expect(result).toBe(true);

    /**
     * When we select the credential again using same query
     */
    const updatedCredential = (await query.getOne()) as Credential;

    /**
     * Then updated credential's updated token should be the same as the new
     * encryption token
     */
    expect(updatedCredential.encryptedToken).toEqual(updatedEncryptedToken);
  });

  it("fails while updating credential", async () => {
    /**
     * Given credential exists in the system
     */
    const user = await createUser(connection, USER_CREATION_ARGS);

    /**
     * When we compose a query to get the credential from database
     * through user id
     */
    const queryArgs = { user_id: user.id };
    const query = getCredentialRepo(connection)
      .createQueryBuilder("credential")
      .where(makeAndWhere(queryArgs, "credential"), queryArgs);

    /**
     * And we run the query
     */
    const credential = (await query.getOne()) as Credential;

    /**
     * Then queried credential's token should be the same as one with which
     * credential was created
     */
    expect(credential.encryptedToken).toEqual(
      USER_CREATION_ARGS.encryptedToken
    );

    /**
     * When we update the credential with new encrypted token but with none
     * existing user
     */
    const updatedEncryptedToken = "534555";

    const result = await updateCredential(
      connection,
      { user_id: 0 },
      {
        encryptedToken: updatedEncryptedToken
      }
    );

    /**
     * Then the result should be false
     */
    expect(result).toBe(false);

    /**
     * When we select the credential again using same query
     */
    const sameCredential = (await query.getOne()) as Credential;

    /**
     * Then the token should not be updated
     */
    expect(sameCredential.encryptedToken).toEqual(
      USER_CREATION_ARGS.encryptedToken
    );
  });
});
