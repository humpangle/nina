export const credential = `
type Credential inherits Timestamps {
  id: ID!
  source: String
  encryptedToken: String!
}
`;
