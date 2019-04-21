export const user = `

type User inherits Timestamps {
  id: ID!
  username: String!
  email: String!
  firstName: String!
  lastName: String!
  jwt: String!
  credential: Credential!
}

input CreateUserInput {
  username: String!
  email: String!
  password: String!
  firstName: String
  lastName: String
}

input LoginInput {
  username: String
  email: String
  password: String!
}
`;

export const userQuery = `
me(username: String, email: String, id: ID): User
`;

export const userMutation = `
createUser(input: CreateUserInput!): User!
login(input: LoginInput!): User!
`;
