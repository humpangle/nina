import { RouteComponentProps } from "@reach/router";
import * as yup from "yup";
import { FormikErrors, FieldProps } from "formik";
import { Reducer } from "react";
import { ApolloError } from "apollo-client";
import { SemanticICONS } from "semantic-ui-react";

import { RegisterUserMutationProps } from "../../graphql/register-user.mutation";
import { CreateUserInput } from "../../apollo-generated";
import {
  makeCreateUserSchemaDefinition,
  userDataLen
} from "@nina/be/src/data/user";
import { UserLocalMutationProps } from "../../local-state/user.local.mutation";

export interface Props
  extends RegisterUserMutationProps,
    RouteComponentProps,
    UserLocalMutationProps {}

export const formUiTexts = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  username: "Username",
  password: "Password",
  repeatPassword: "Repeat password"
} as { [k in keyof FormValues]: string };

export const formErrorTexts = {
  email: { required: formUiTexts.email + " isn't valid" },

  username: {
    required: `${formUiTexts.username} must be between ${
      userDataLen.usernameMin
    } and ${userDataLen.usernameMax} characters long`
  },

  password: {
    required: `${formUiTexts.password} must be between ${
      userDataLen.passwordMin
    } and ${userDataLen.passwordMax} characters long`
  }
};

export const signupUiTexts = {
  form: { ...formUiTexts, submitBtnText: "Create my account" },
  passwordsDontMatchError: "Passwords don't match",
  networkError: "Unable to create your account: network error"
};

export interface FormValues extends CreateUserInput {
  repeatPassword: string;
}

export const initialFormValues: FormValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  repeatPassword: ""
};

export const validationSchema = yup.object<FormValues>().shape<FormValues>({
  ...makeCreateUserSchemaDefinition(formErrorTexts),
  repeatPassword: yup
    .string()
    .required(formErrorTexts.password.required)
    .test("passwords-match", signupUiTexts.passwordsDontMatchError, function(
      val
    ) {
      return this.parent.password === val;
    })
});

export type FormErrors = FormikErrors<FormValues>;

export interface ServerErrors {
  networkError: string;
  graphQLError: FormErrors;
}

export interface State {
  readonly formErrors?: FormErrors | null;
  readonly serverErrors?: ServerErrors | null;
}

export const reducer: Reducer<State, State> = function reducerFn(
  prevState,
  action
) {
  return { ...prevState, ...action };
};

export function objectifyApolloError(
  apolloErrors: ApolloError
): { graphQLError: FormErrors; networkError: string } {
  const { graphQLErrors, networkError } = apolloErrors;

  if (networkError) {
    return { networkError: signupUiTexts.networkError, graphQLError: {} };
  }

  const graphQLError = Object.entries(
    JSON.parse(graphQLErrors[0].message)
  ).reduce(
    (acc, [key, val]) => {
      acc[key] = formUiTexts[key] + " " + val;

      return acc;
    },
    {} as FormErrors
  );

  return { graphQLError, networkError: "" };
}

export interface FormFieldProps extends FieldProps<FormValues> {
  label: string;
  type: string;
  iconName: SemanticICONS;
  errors: string;
}
