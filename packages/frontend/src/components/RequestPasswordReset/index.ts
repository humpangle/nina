import { graphql } from "react-apollo";

import { RequestPasswordReset as App } from "./request-password-reset-x";
import {
  REQUEST_PASSWORD_RESET_MUTATION,
  RequestPasswordResetProps
} from "../../graphql/request-password-reset.mutation";
import {
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables
} from "../../apollo-generated";

const requestPasswordResetGql = graphql<
  {},
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables,
  RequestPasswordResetProps | undefined
>(REQUEST_PASSWORD_RESET_MUTATION, {
  props: ({ mutate }) =>
    mutate && {
      requestPasswordReset: mutate
    }
});

export const RequestPasswordReset = requestPasswordResetGql(App);
