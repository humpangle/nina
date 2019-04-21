import gql from "graphql-tag";

import { REGISTER_USER_FRAGMENT } from "./register-user.fragment";

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...RegisterUser
    }
  }

  ${REGISTER_USER_FRAGMENT}
`;
