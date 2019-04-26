// tslint:disable: no-any
import { Server } from "http";
import { AddressInfo } from "ws";
import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";
import { toPromise, execute, GraphQLRequest } from "apollo-link";
import gql from "graphql-tag";
import { createConnection, ConnectionOptions } from "typeorm";

import { CreateUserInput } from "@nina/common";
import connOpts from "../ormconfig";

export const USER_CREATION_ARGS: CreateUserInput = {
  username: "john",
  email: "a@b.com",
  password: "12345"
};

export const CREATE_USER_MUTATION = gql`
  mutation CreateAUser($input: CreateUserInput!) {
    createUser(input: $input) {
      jwt
    }
  }
`;

export const LOGIN_USER_MUTATION = gql`
  mutation LoginAUser($input: LoginInput!) {
    login(input: $input) {
      jwt
    }
  }
`;

export function startLiveTestServer(webServer: Server) {
  const server = webServer.listen(0);
  const { port } = server.address() as AddressInfo;

  const link = new HttpLink({
    uri: `http://127.0.0.1:${port}/graphql`,

    fetch: fetch as any
  });

  return {
    stop: () => {
      webServer.close();
    },

    doQuery: (operation: GraphQLRequest) => {
      return toPromise(execute(link, operation));
    }
  };
}

export function connectToDb() {
  return createConnection(connOpts as ConnectionOptions);
}
