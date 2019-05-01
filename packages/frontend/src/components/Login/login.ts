import * as yup from "yup";
import { RouteComponentProps } from "@reach/router";

import { LoginUserMutationProps } from "../../graphql/login.mutation";
import { UserLocalMutationProps } from "../../local-state/user.local.mutation";
import { ApolloError } from "apollo-client";

export interface Props
  extends RouteComponentProps<{}>,
    LoginUserMutationProps,
    UserLocalMutationProps {}

export interface FormValues {
  usernameEmail: string;
  password: string;
}

export const loginFormInitialValues: FormValues = {
  usernameEmail: "",
  password: ""
};

export const loginFormLabels: { [k in keyof FormValues]: string } = {
  usernameEmail: "Username or email address",
  password: "Password"
};
export const loginSubmitButtonText = "Log in";
export const networkErrorString = "Network Error";
export const loginErrorTestId = "login-error";
export const loginHeader = "Log in to Nina";
export const forgotPasswordLinkText = "Forgot password?";

export function makeFormFieldTestId(name: keyof FormValues) {
  return `form-field-${name}`;
}

export const emailValidator = yup.string().email();

export interface State {
  readonly graphqlError?: string;
  readonly shouldClearPassword?: boolean;
  readonly networkError?: string;
}

export function parseApolloError(errors: ApolloError): State {
  const { graphQLErrors, networkError } = errors;

  if (networkError) {
    return { networkError: networkErrorString };
  }

  return { graphqlError: graphQLErrors[0].message };
}
