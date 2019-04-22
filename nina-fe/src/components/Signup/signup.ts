import { RegisterUserMutationProps } from "../../graphql/register-user.mutation";
import { CreateUserInput } from "../../apollo-generated";
import { RouteComponentProps } from "@reach/router";

export interface Props extends RegisterUserMutationProps, RouteComponentProps {}

export const formUiTexts = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  username: "Username",
  password: "Password",
  repeatPassword: "Repeat password"
} as { [k in keyof FormValues]: string };

export const signupUiTexts = {
  form: { ...formUiTexts, submitBtnText: "Create my account" }
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
