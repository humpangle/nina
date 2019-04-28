import { Connection } from "typeorm";

import {
  startLiveTestServer,
  CREATE_USER_MUTATION,
  USER_CREATION_ARGS,
  LOGIN_USER_MUTATION,
  connectToDb,
  DB_USER_CREATION_ARGS
} from "./utils";
import { setupServer } from "../server-setup";
import {
  INVALID_INPUT_ERROR_TITLE,
  INVALID_LOGIN_INPUT_ERROR,
  MutationCreateUserArgs,
  MutationLoginArgs
} from "@nina/common";
import { dbCreateUser } from "../data";

let connection: Connection;
let stopServer: () => void;

afterEach(() => {
  if (connection) {
    connection.close();
  }

  if (stopServer) {
    stopServer();
  }
});

describe("create user", () => {
  it("is successful", async () => {
    const { query } = await setup();
    /**
     * When we create user
     */
    const result = await query({
      query: CREATE_USER_MUTATION,
      variables: {
        input: USER_CREATION_ARGS
      }
    });

    /**
     * Then user jwt should exist
     */
    expect(result.data.createUser.jwt.length).toBeGreaterThan(0);
  });

  it("fails", async () => {
    const { query } = await setup(false);

    /**
     * When we create user with wrong password length, then we should get error
     */
    const result = await query({
      query: CREATE_USER_MUTATION,
      variables: {
        input: {
          username: "john",
          email: "a@b.com",
          password: "1234"
        }
      } as MutationCreateUserArgs
    });

    expect(result.errors[0].message).toEqual(INVALID_INPUT_ERROR_TITLE);
  });
});

describe("login user", () => {
  it("is successful", async () => {
    /**
     * Given there is a user in the system
     */
    const { query } = await setup();
    const user = await dbCreateUser(connection, DB_USER_CREATION_ARGS);

    /**
     * When we login the user
     */
    const result = await query({
      query: LOGIN_USER_MUTATION,
      variables: {
        input: {
          username: user.username,
          password: "12345"
        }
      } as MutationLoginArgs
    });

    /**
     * Then user jwt should exist
     */
    expect(result.data.login.jwt.length).toBeGreaterThan(0);
  });

  it("fails", async () => {
    /**
     * When we attempt to login a user that does not exist
     */
    const { query } = await setup();

    const result = await query({
      query: LOGIN_USER_MUTATION,
      variables: {
        input: {
          username: "not found",
          password: "12345"
        }
      } as MutationLoginArgs
    });

    /**
     * Then we should get an error
     */
    expect(result.errors[0].message).toEqual(INVALID_LOGIN_INPUT_ERROR);
  });
});

async function setup(useDb: boolean = true) {
  connection = (useDb
    ? await connectToDb()
    : { close: jest.fn() }) as Connection;
  const { webServer } = setupServer(connection);
  const { stop, doQuery } = startLiveTestServer(webServer);
  stopServer = stop;

  return { query: doQuery };
}
