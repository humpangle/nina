import gql from "graphql-tag";
import { MutationFn, DataProps } from "react-apollo";

import { REGISTER_USER_FRAGMENT } from "./register-user.fragment";
import {
  RegisterUserMutation,
  RegisterUserMutationVariables
} from "../apollo-generated";

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...RegisterUser
    }
  }

  ${REGISTER_USER_FRAGMENT}
`;

export type RegisterUserMutationFn = MutationFn<
  RegisterUserMutation,
  RegisterUserMutationVariables
>;

export type RegisterUserMutationResolved = DataProps<
  RegisterUserMutation,
  RegisterUserMutationVariables
>;

export interface RegisterUserMutationProps {
  registerUser: RegisterUserMutationFn;
}
