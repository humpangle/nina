import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { MutationFn } from "react-apollo";

import { REGISTER_USER_FRAGMENT } from "../graphql/register-user.fragment";
import { RegisterUserFragment } from "../apollo-generated";

export const userLocalMutation = gql`
  mutation UserLocalMutation($user: LocalUserInput!) {
    user(user: $user) @client {
      ...RegisterUser
    }
  }

  ${REGISTER_USER_FRAGMENT}
`;

export default userLocalMutation;

export interface UserMutationVariable {
  user: RegisterUserFragment | null;
}

export type UserLocalMutationFn = MutationFn<
  UserMutationVariable,
  UserMutationVariable
>;

export interface UserLocalMutationProps {
  updateLocalUser?: UserLocalMutationFn;
}

export const userLocalMutationGql = graphql<
  {},
  UserMutationVariable,
  UserMutationVariable,
  UserLocalMutationProps | void
>(userLocalMutation, {
  props: ({ mutate }) =>
    mutate && {
      updateLocalUser: mutate
    }
});
