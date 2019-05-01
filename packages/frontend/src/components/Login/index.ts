import { compose, graphql } from "react-apollo";

import { Login as Comp } from "./login-x";
import {
  LOGIN_USER_MUTATION,
  LoginUserMutationProps
} from "../../graphql/login.mutation";
import {
  LoginUserMutation,
  LoginUserMutationVariables
} from "../../apollo-generated";
import { userLocalMutationGql } from "../../local-state/user.local.mutation";

const loginUserGql = graphql<
  {},
  LoginUserMutation,
  LoginUserMutationVariables,
  LoginUserMutationProps | undefined
>(LOGIN_USER_MUTATION, {
  props: ({ mutate }) =>
    mutate && {
      login: mutate
    }
});

export const Login = compose(
  loginUserGql,
  userLocalMutationGql
)(Comp);
