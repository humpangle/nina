// tslint:disable: no-any
import React, { ComponentType } from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, wait, fireEvent, waitForElement } from "react-testing-library";

import { Login } from "../components/Login/login-x";
import {
  Props,
  loginFormLabels,
  loginSubmitButtonText,
  networkErrorString,
  forgotPasswordLinkText,
  makeFormFieldTestId,
  loginFormTestId
} from "../components/Login/login";
import { renderWithRouter, fillField } from "./utils";
import { APP_WELCOME_PATH } from "../routing";
import { LoginUserMutationResolved } from "../graphql/login.mutation";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

type P = ComponentType<Partial<Props>>;
const LoginP = Login as P;

it("logins in successfully with email", async () => {
  const { ui, mockLoginUser, mockNavigate, mockUpdateLocalUser } = renderComp();

  const result = {
    data: {
      login: {}
    }
  } as LoginUserMutationResolved;

  mockLoginUser.mockResolvedValue(result);

  const password = "123456";
  const email = "a@b.com";

  /**
   * Given we are using the login component
   */

  const { getByLabelText, getByText, getByTestId } = render(ui);

  /**
   * And we fill the username/email field with email
   */
  const $usernameEmail = getByLabelText(
    loginFormLabels.usernameEmail
  ) as HTMLInputElement;
  fillField($usernameEmail, email);

  /**
   * Then username/email field should not contain link to forgot password page
   */
  const $forgotPassword = getByText(forgotPasswordLinkText);

  expect(
    getByTestId(makeFormFieldTestId("usernameEmail"))
  ).not.toContainElement($forgotPassword);

  /**
   * When we fill the password field
   */
  fillField(getByLabelText(loginFormLabels.password), password);

  /**
   * Then password field should contain link to forgot password page
   */

  expect(getByTestId(makeFormFieldTestId("password"))).toContainElement(
    $forgotPassword
  );

  /**
   * And submit the form
   */
  fireEvent.click(getByText(loginSubmitButtonText));

  /**
   * Then the correct data should be sent to the server
   */
  await wait(
    () => {
      expect(mockLoginUser).toBeCalledWith({
        variables: {
          input: {
            password,
            email
          }
        }
      });
    },
    { interval: 1 }
  );

  /**
   * And we should store server returned value
   */
  expect(mockUpdateLocalUser).toBeCalledWith({
    variables: { user: result.data.login }
  });

  /**
   * And we should be redirected
   */
  expect(mockNavigate).toBeCalledWith(APP_WELCOME_PATH);
});

it("logins in successfully with username", async () => {
  const { ui, mockLoginUser, mockNavigate, mockUpdateLocalUser } = renderComp();

  const result = {
    data: {
      login: {}
    }
  } as LoginUserMutationResolved;

  mockLoginUser.mockResolvedValue(result);

  const password = "123456";
  const username = "john";

  /**
   * Given we are using the login component
   */

  const { getByLabelText, getByText } = render(ui);

  /**
   * And we fill the username/email field with username
   */
  fillField(getByLabelText(loginFormLabels.usernameEmail), username);

  /**
   * And fill the password field
   */
  fillField(getByLabelText(loginFormLabels.password), password);

  /**
   * And submit the form
   */
  fireEvent.click(getByText(loginSubmitButtonText));

  /**
   * Then the correct data should be sent to the server
   */
  await wait(
    () => {
      expect(mockLoginUser).toBeCalledWith({
        variables: {
          input: {
            password,
            username
          }
        }
      });
    },
    { interval: 1 }
  );

  /**
   * And we should store server returned value
   */
  expect(mockUpdateLocalUser).toBeCalledWith({
    variables: { user: result.data.login }
  });

  /**
   * And we should be redirected
   */
  expect(mockNavigate).toBeCalledWith(APP_WELCOME_PATH);
});

it("renders error when server returns user input error", async () => {
  const { ui, mockLoginUser, mockNavigate } = renderComp();
  const errorText = "invalid user input";

  mockLoginUser.mockRejectedValue(
    new ApolloError({
      graphQLErrors: [new GraphQLError(errorText)]
    })
  );

  /**
   * Given we are using the login component
   */
  const { queryByText, getByLabelText, getByText } = render(ui);

  /**
   * Then we should not see user input error
   */
  expect(queryByText(errorText)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see user input error
   */
  const $error = await waitForElement(() => getByText(errorText));
  expect($error).toBeInTheDocument();

  /**
   * And password field should be empty
   */
  const $password = getByLabelText(
    loginFormLabels.password
  ) as HTMLInputElement;
  expect($password.value).toBe("");

  /**
   * And we should not be redirected
   */
  expect(mockNavigate).not.toBeCalled();

  /**
   * When we focus on the password field
   */
  fireEvent.focus($password);

  /**
   * Then password field should still be empty
   */
  expect($password.value).toBe("");

  /**
   * When we type again in the password field
   */

  fillField($password, "another password");

  /**
   * Then we should see the password
   */
  expect($password.value).toBe("another password");
});

it("renders error when server returns network error", async () => {
  const { ui, mockLoginUser, mockNavigate } = renderComp();

  mockLoginUser.mockRejectedValue(
    new ApolloError({
      networkError: new Error("network problems")
    })
  );

  /**
   * Given we are using the login component
   */
  const { queryByText, getByLabelText, getByText } = render(ui);

  /**
   * Then we should not see network error
   */
  expect(queryByText(networkErrorString)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see network error
   */
  const $error = await waitForElement(() => getByText(networkErrorString));
  expect($error).toBeInTheDocument();

  /**
   * And we should not be redirected
   */
  expect(mockNavigate).not.toBeCalled();

  /**
   * And password field should not be cleared
   */
  expect((getByLabelText(loginFormLabels.password) as any).value).toBe(
    "123456"
  );
});

it("blurs form while submitting", async () => {
  const { ui, mockLoginUser } = renderComp();

  mockLoginUser.mockRejectedValue(
    new ApolloError({
      networkError: new Error("network")
    })
  );

  /**
   * Given that we are using the login component
   */

  const { getByText, getByTestId } = render(ui);

  /**
   * Then the form should not be blurred
   */
  const $form = getByTestId(loginFormTestId);
  expect($form.classList).not.toContain("form-submitting");

  /**
   * When we submit the form
   */
  fireEvent.click(getByText(loginSubmitButtonText));

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
  const mockLoginUser = jest.fn();
  const mockUpdateLocalUser = jest.fn();

  const { Ui, ...rest } = renderWithRouter(LoginP);

  return {
    ui: <Ui login={mockLoginUser} updateLocalUser={mockUpdateLocalUser} />,
    mockLoginUser,
    mockUpdateLocalUser,
    ...rest
  };
}

function fillAndSubmitForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText(loginFormLabels.usernameEmail), "john");
  fillField(getByLabelText(loginFormLabels.password), "123456");
  fireEvent.click(getByText(loginSubmitButtonText));
}
