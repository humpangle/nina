import gql from "graphql-tag";
import { MutationFn, DataProps } from "react-apollo";

import { REGISTER_USER_FRAGMENT } from "./register-user.fragment";
import {
  LoginUserMutation,
  LoginUserMutationVariables
} from "../apollo-generated";

export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      ...RegisterUser
    }
  }

  ${REGISTER_USER_FRAGMENT}
`;

export type LoginUserMutationFn = MutationFn<
  LoginUserMutation,
  LoginUserMutationVariables
>;

export type LoginUserMutationResolved = DataProps<
  LoginUserMutation,
  LoginUserMutationVariables
>;

export interface LoginUserMutationProps {
  login: LoginUserMutationFn;
}
