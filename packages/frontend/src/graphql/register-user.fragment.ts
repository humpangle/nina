import gql from "graphql-tag";

export const REGISTER_USER_FRAGMENT = gql`
  fragment RegisterUser on User {
    id
    username
    email
    jwt
  }
`;
