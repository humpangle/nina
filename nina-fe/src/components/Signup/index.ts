import { graphql, compose } from "react-apollo";

import { Signup as Comp } from "./signup-x";
import {
  RegisterUserMutation,
  RegisterUserMutationVariables
} from "../../apollo-generated";
import {
  REGISTER_USER_MUTATION,
  RegisterUserMutationProps
} from "../../graphql/register-user.mutation";
import { userLocalMutationGql } from "../../local-state/user.local.mutation";

const createUserGql = graphql<
  {},
  RegisterUserMutation,
  RegisterUserMutationVariables,
  RegisterUserMutationProps | undefined
>(REGISTER_USER_MUTATION, {
  props: ({ mutate }) =>
    mutate && {
      registerUser: mutate
    }
});

export const Signup = compose(
  createUserGql,
  userLocalMutationGql
)(Comp);
