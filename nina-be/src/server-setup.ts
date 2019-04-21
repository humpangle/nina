import { Connection } from "typeorm";
import express from "express";
import cors from "cors";
import morganLogger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { createServer } from "http";

import { schema } from "./graphql/schema.graphql";
import { userResolver } from "./graphql/user.resolver";

const IS_TEST = process.env.NODE_ENV === "test";
const IS_DEV = process.env.NODE_ENV === "development";

export interface NinaContext {
  connection: Connection;
}

export function setupServer(connection: Connection) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  /* istanbul ignore next: we don't care about logging in tests */
  if (!IS_TEST) {
    app.use(morganLogger("combined"));
  }

  const apolloServer = new ApolloServer({
    typeDefs: (schema as unknown) as DocumentNode,

    resolvers: [
      {
        Query: {}
      },

      userResolver
      // tslint:disable-next-line: no-any
    ] as any,

    introspection: IS_DEV,

    playground: IS_DEV,

    context: async function createContext() {
      return { connection };
    }
  });

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  const webServer = createServer(app);
  apolloServer.installSubscriptionHandlers(webServer);

  return {
    apolloServer,
    app,
    webServer
  };
}
