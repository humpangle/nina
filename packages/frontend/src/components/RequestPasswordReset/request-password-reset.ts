import * as yup from "yup";
import { Reducer } from "react";
import { RouteComponentProps } from "@reach/router";
import { RequestPasswordResetProps } from "../../graphql/request-password-reset.mutation";
import { ApolloError } from "apollo-client";

export interface Props extends RouteComponentProps, RequestPasswordResetProps {}

const resetPasswordRequestSuccess1 = "Instructions for resetting your ";

export const resetPasswordRequestSuccess2 = "password have been emailed to you";

export const resetPasswordRequestSuccess =
  resetPasswordRequestSuccess1 + resetPasswordRequestSuccess2;

export const resetPasswordRequestBtnText = "Reset my password";
export const instruction =
  "To reset your password, please enter the email address of your Nina account.";

export const invalidEmailErrorText = "Invalid email";
export const unknownServerErrorText = "Request unsuccessful";
export const gqlErrorText = "Email is unknown to us";
export const networkErrorText = "Network Error";
export const toLoginIconTestId = "to-login-icon";

export const emailValidator = yup
  .string()
  .required(invalidEmailErrorText)
  .email(invalidEmailErrorText);

export interface State {
  readonly email: string;
  readonly resetRequestSuccess?: boolean;
  readonly formError?: string;
  readonly serverError?: string;
  readonly gqlError?: string;
  readonly networkError?: string;
}

export const reducer: Reducer<State, Partial<State>> = function reducerFn(
  prevState,
  action
) {
  return { ...prevState, ...action };
};

export function parseGraphqlErrors({
  networkError
}: ApolloError): Partial<State> {
  if (networkError) {
    return { networkError: networkErrorText };
  }

  return { gqlError: gqlErrorText };
}
