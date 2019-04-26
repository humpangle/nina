// tslint:disable:no-var-requires

import { credential } from "./credential.graphql";
import { user, userMutation } from "./user.graphql";

const { graphqls2s } = require("graphql-s2s");

const schemaString = `
scalar Date

type Timestamps {
  insertedAt: Date!
  updatedAt: Date!
}

${user}
${credential}

type Query {
  noop: Boolean
}

type Mutation {
  ${userMutation}
}
`;

export const schema: string = graphqls2s.transpileSchema(schemaString);

export default schema;
