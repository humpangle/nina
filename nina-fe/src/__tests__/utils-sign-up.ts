// tslint:disable: no-any
import { signupUiTexts } from "../components/Signup/signup";

export const firstNameInputReg = new RegExp(
  signupUiTexts.form.firstName as any,
  "i"
);

export const lastNameInputReg = new RegExp(
  signupUiTexts.form.lastName as any,
  "i"
);

export const usernameInputReg = new RegExp(signupUiTexts.form.username, "i");

export const emailInputReg = new RegExp(signupUiTexts.form.email, "i");

export const passwordInputReg = new RegExp(signupUiTexts.form.password, "i");

export const repeatPasswordInputReg = new RegExp(
  signupUiTexts.form.repeatPassword,
  "i"
);

export const submitBtnTextReg = new RegExp(
  signupUiTexts.form.submitBtnText,
  "i"
);
