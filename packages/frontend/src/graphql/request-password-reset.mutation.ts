import gql from "graphql-tag";
import { DataProps, MutationFn } from "react-apollo";

import {
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables
} from "../apollo-generated";

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export type RequestPasswordResetFn = MutationFn<
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables
>;

export type RequestPasswordResetResolved = DataProps<
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables
>;

export interface RequestPasswordResetProps {
  requestPasswordReset: RequestPasswordResetFn;
}
