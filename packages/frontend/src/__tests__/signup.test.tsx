// tslint:disable: no-any
import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait, waitForElement } from "react-testing-library";

import { Signup } from "../components/Signup/signup-x";
import {
  Props,
  signupUiTexts,
  formErrorTexts,
  formUiTexts,
  signupFormTestId
} from "../components/Signup/signup";
import { fillField, renderWithRouter } from "./utils";
import { CreateUserInput } from "../apollo-generated";
import { APP_WELCOME_PATH } from "../routing";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";
import { RegisterUserMutationResolved } from "../graphql/register-user.mutation";
import {
  lastNameInputReg,
  usernameInputReg,
  emailInputReg,
  passwordInputReg,
  repeatPasswordInputReg,
  submitBtnTextReg,
  firstNameInputReg
} from "./utils-sign-up";

type P = React.ComponentType<Partial<Props>>;
const SignupP = Signup as P;

it("renders form errors", async () => {
  /**
   * Given that we are using the sign up component
   */
  const { ui, mockRegisterUser } = renderComp();
  const { getByText, queryByText } = render(ui);

  /**
   * And we do not see any texts indicating form errors
   */
  expect(queryByText(formErrorTexts.email.required)).not.toBeInTheDocument();

  /**
   * When we do not complete the form properly and submit the form
   */
  fireEvent.click(getByText(submitBtnTextReg));

  /**
   * Then we should see form errors
   */

  const $error0 = await waitForElement(() =>
    getByText(formErrorTexts.email.required)
  );
  expect($error0).toBeInTheDocument();

  Object.values(formErrorTexts).forEach(v => {
    expect(getByText(v.required)).toBeInTheDocument();
  });

  /**
   * And no upload to the server should happen
   */

  expect(mockRegisterUser).not.toBeCalled();
});

it("renders passwords don't match error", async () => {
  /**
   * Given that we are using the sign up component
   */
  const { ui } = renderComp();
  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * And we do not see text stating that passwords do not match
   */
  expect(
    queryByText(signupUiTexts.passwordsDontMatchError)
  ).not.toBeInTheDocument();

  /**
   * When we do not fill password and repeat password fields with the same
   * texts
   */
  fillField(getByLabelText(passwordInputReg), "123456");
  fillField(getByLabelText(repeatPasswordInputReg), "123456-");

  /**
   * And we submit the form
   */
  fireEvent.click(getByText(submitBtnTextReg));

  /**
   * Then we should see errors telling us passwords don't match
   */
  const $error = await waitForElement(() =>
    getByText(signupUiTexts.passwordsDontMatchError)
  );
  expect($error).toBeInTheDocument();
});

it("renders server user input error", async () => {
  /**
   * Given that we are using the sign up component
   */
  const { ui, mockRegisterUser, mockNavigate } = renderComp();
  mockRegisterUser.mockRejectedValue(
    new ApolloError({
      graphQLErrors: [
        new GraphQLError(JSON.stringify({ email: "already exists." }))
      ]
    })
  );

  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * And we do not see texts indicating 'email exists' error
   */
  const error = `${formUiTexts.email} already exists.`;
  expect(queryByText(error)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see error
   */
  const $error = await waitForElement(() => getByText(error));

  expect($error).toBeInTheDocument();

  /**
   * And we should not be redirected
   */
  expect(mockNavigate).not.toBeCalled();
});

it("renders network error", async () => {
  /**
   * Given that we are using the sign up component
   */
  const { ui, mockRegisterUser } = renderComp();

  mockRegisterUser.mockRejectedValue(
    new ApolloError({
      networkError: new Error("")
    })
  );

  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * And we do not see texts indicating network error
   */
  expect(queryByText(signupUiTexts.networkError)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see error
   */
  const $error = await waitForElement(() =>
    getByText(signupUiTexts.networkError)
  );

  expect($error).toBeInTheDocument();
});

it("submits successfully", async () => {
  /**
   * Given that we are using the sign up component
   */
  const {
    ui,
    mockRegisterUser,
    mockUpdateLocalUser,
    mockNavigate
  } = renderComp();
  const value = {
    data: {
      createUser: {}
    }
  } as RegisterUserMutationResolved;

  mockRegisterUser.mockResolvedValue(value);

  const { getByText, getByLabelText } = render(ui);

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then the proper data should be uploaded to the server
   */
  await wait(
    () => {
      expect(mockRegisterUser.mock.calls[0][0].variables.input).toEqual({
        username: "johnny",
        email: "a@b.com",
        password: "123456",
        firstName: "john",
        lastName: "doe"
      } as CreateUserInput);
    },
    { interval: 1 }
  );

  /**
   * And we should be able to save the returned user
   */
  await wait(
    () => {
      expect(mockUpdateLocalUser).toBeCalledWith({
        variables: { user: value.data.createUser }
      });
    },
    { interval: 1 }
  );

  /**
   * And we should be redirected to the app root page
   */

  expect(mockNavigate).toBeCalledWith(APP_WELCOME_PATH);
});

it("renders non JSON parse-able error", async () => {
  /**
   * Given that we are using the sign up component
   */
  const { ui, mockRegisterUser, mockNavigate } = renderComp();

  const errorMessage = "some error message";

  mockRegisterUser.mockRejectedValue(
    new ApolloError({
      graphQLErrors: [new GraphQLError(errorMessage)]
    })
  );

  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * And we do not see texts indicating error occurred
   */
  expect(queryByText(errorMessage)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see error
   */
  const $error = await waitForElement(() => getByText(errorMessage));

  expect($error).toBeInTheDocument();

  /**
   * And we should not be redirected
   */
  expect(mockNavigate).not.toBeCalled();
});

it("blurs form while submitting", async () => {
  /**
   * Given that we are using the sign up component
   */
  const { ui } = renderComp();

  const { getByText, getByTestId } = render(ui);

  /**
   * Then the form should not be blurred
   */
  const $form = getByTestId(signupFormTestId);
  expect($form.classList).not.toContain("form-submitting");

  /**
   * When we submit the form
   */
  fireEvent.click(getByText(signupUiTexts.form.submitBtnText));

  /**
   * Then the form should be blurred
   */
  expect($form.classList).toContain("form-submitting");

  /**
   * And a while later the form should no longer be blurred
   */
  await wait(
    () => {
      expect($form.classList).not.toContain("form-submitting");
    },
    {
      interval: 1
    }
  );
});

function renderComp() {
  const mockRegisterUser = jest.fn();
  const mockUpdateLocalUser = jest.fn();

  const { Ui, ...rest } = renderWithRouter(SignupP);

  return {
    ui: (
      <Ui
        registerUser={mockRegisterUser}
        updateLocalUser={mockUpdateLocalUser}
      />
    ),
    mockRegisterUser,
    mockUpdateLocalUser,
    ...rest
  };
}

function fillAndSubmitForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText(firstNameInputReg), "john");
  fillField(getByLabelText(lastNameInputReg), "doe");
  fillField(getByLabelText(usernameInputReg), "johnny");
  fillField(getByLabelText(emailInputReg), "a@b.com");
  fillField(getByLabelText(passwordInputReg), "123456");
  fillField(getByLabelText(repeatPasswordInputReg), "123456");
  fireEvent.click(getByText(submitBtnTextReg));
}
