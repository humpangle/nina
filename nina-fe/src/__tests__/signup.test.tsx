// tslint:disable: no-any
import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait } from "react-testing-library";

import { Signup } from "../components/Signup/signup-x";
import { Props, signupUiTexts } from "../components/Signup/signup";
import { fillField } from "./utils";
import { CreateUserInput } from "../apollo-generated";
import { APP_ROOT } from "../routing";

type P = React.ComponentType<Partial<Props>>;
const SignupP = Signup as P;

it("signs up successfully", async () => {
  const mockRegisterUser = jest.fn();
  const mockNavigate = jest.fn();

  /**
   * Given that we are at the sign up component
   */
  const { getByLabelText, getByText } = render(
    <SignupP registerUser={mockRegisterUser} navigate={mockNavigate} />
  );

  /**
   * When we complete and submit the form
   */
  fillField(
    getByLabelText(new RegExp(signupUiTexts.form.firstName as any, "i")),
    "john"
  );

  fillField(
    getByLabelText(new RegExp(signupUiTexts.form.lastName as any, "i")),
    "doe"
  );

  fillField(
    getByLabelText(new RegExp(signupUiTexts.form.username, "i")),
    "johnny"
  );

  fillField(
    getByLabelText(new RegExp(signupUiTexts.form.email, "i")),
    "a@b.com"
  );

  fillField(
    getByLabelText(new RegExp(signupUiTexts.form.password, "i")),
    "123456"
  );

  fillField(
    getByLabelText(new RegExp(signupUiTexts.form.repeatPassword, "i")),
    "123456"
  );

  fireEvent.click(getByText(new RegExp(signupUiTexts.form.submitBtnText, "i")));

  /**
   * Then the proper data should be uploaded to the server
   */
  expect(mockRegisterUser.mock.calls[0][0].variables.input).toEqual({
    username: "johnny",
    email: "a@b.com",
    password: "123456",
    firstName: "john",
    lastName: "doe"
  } as CreateUserInput);

  /**
   * And we should be redirected to app root page
   */
  await wait(
    () => {
      expect(mockNavigate).toBeCalledWith(APP_ROOT);
    },
    { interval: 1 }
  );
});
