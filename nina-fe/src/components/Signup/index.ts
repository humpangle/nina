import { graphql } from "react-apollo";

import { Signup as Comp } from "./signup-x";
import {
  RegisterUserMutation,
  RegisterUserMutationVariables
} from "../../apollo-generated";
import {
  REGISTER_USER_MUTATION,
  RegisterUserMutationProps
} from "../../graphql/register-user.mutation";

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

export const Signup = createUserGql(Comp);
