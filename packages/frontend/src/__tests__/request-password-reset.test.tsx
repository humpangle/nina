// tslint:disable: no-any

import React, { ComponentType } from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, waitForElement, fireEvent } from "react-testing-library";

import { RequestPasswordReset } from "../components/RequestPasswordReset/request-password-reset-x";
import {
  resetPasswordRequestSuccess2,
  resetPasswordRequestBtnText,
  invalidEmailErrorText,
  Props,
  unknownServerErrorText,
  gqlErrorText,
  networkErrorText,
  toLoginIconTestId
} from "../components/RequestPasswordReset/request-password-reset";
import { fillField, renderWithRouter } from "./utils";
import { RequestPasswordResetResolved } from "../graphql/request-password-reset.mutation";
import { ApolloError } from "apollo-client";
import { LOGIN_PATH } from "../routing";

type P = ComponentType<Partial<Props>>;
const RequestPasswordResetP = RequestPasswordReset as P;

it("requests password reset successfully", async () => {
  const resetPasswordRequestSuccessRegexp = new RegExp(
    resetPasswordRequestSuccess2
  );

  const { ui, mockRequestPasswordReset } = setUp();

  const result = {
    data: { requestPasswordReset: "token" }
  } as RequestPasswordResetResolved;

  mockRequestPasswordReset.mockResolvedValue(result);

  /**
   * Given we are using the request password reset component
   */
  const { queryByText, getByText, queryByLabelText } = render(ui);

  /**
   * Then we should not see instruction for resetting password
   */
  expect(
    queryByText(resetPasswordRequestSuccessRegexp)
  ).not.toBeInTheDocument();

  /**
   * When we fill in the email field and submit the form
   */
  const email = "a@b.com";
  const $email = queryByLabelText("Email") as Element;
  fillField($email, email);
  fireEvent.click(getByText(resetPasswordRequestBtnText));

  /**
   * Then we should see instruction for resetting the password
   */
  const $elm = await waitForElement(() => {
    return getByText(resetPasswordRequestSuccessRegexp);
  });

  expect($elm).toBeInTheDocument();

  /**
   * And we should no longer see the email field
   */
  expect($email).not.toBeInTheDocument();

  /**
   * And the correct data should be sent to the server
   */
  expect(mockRequestPasswordReset).toBeCalledWith({
    variables: { email }
  });
});

it("renders error when email is invalid", async () => {
  const { ui, mockRequestPasswordReset } = setUp();
  /**
   * Given we are using the request password reset component
   */
  const { queryByText, getByText, getByLabelText } = render(ui);

  /**
   * Then we should not see error message
   */
  expect(queryByText(invalidEmailErrorText)).not.toBeInTheDocument();

  /**
   * When we fill in the email field with invalid email and submit the form
   */
  fillForm(getByText, getByLabelText, "a@b");

  /**
   * Then we should see error message
   */
  const $elm = await waitForElement(() => {
    return getByText(invalidEmailErrorText);
  });

  expect($elm).toBeInTheDocument();

  /**
   * And no data should be uploaded to the server
   */
  expect(mockRequestPasswordReset).not.toBeCalled();
});

it("renders error if server returns no token", async () => {
  const { ui, mockRequestPasswordReset } = setUp();

  const result = {
    data: {}
  } as RequestPasswordResetResolved;

  mockRequestPasswordReset.mockResolvedValue(result);

  /**
   * Given we are using the request password reset component
   */
  const { queryByText, getByText, getByLabelText } = render(ui);

  /**
   * Then we should not see error message
   */
  expect(queryByText(unknownServerErrorText)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillForm(getByText, getByLabelText);

  /**
   * Then we should see error message
   */
  const $elm = await waitForElement(() => {
    return getByText(unknownServerErrorText);
  });

  expect($elm).toBeInTheDocument();
});

it("renders error if server returns graphql error", async () => {
  const { ui, mockRequestPasswordReset } = setUp();

  mockRequestPasswordReset.mockRejectedValue(
    new ApolloError({
      graphQLErrors: []
    })
  );

  /**
   * Given we are using the request password reset component
   */
  const { queryByText, getByText, getByLabelText } = render(ui);

  /**
   * Then we should not see error message
   */
  expect(queryByText(gqlErrorText)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillForm(getByText, getByLabelText);

  /**
   * Then we should see error message
   */
  const $elm = await waitForElement(() => {
    return getByText(gqlErrorText);
  });

  expect($elm).toBeInTheDocument();
});

it("renders error if server returns network error", async () => {
  const { ui, mockRequestPasswordReset } = setUp();

  mockRequestPasswordReset.mockRejectedValue(
    new ApolloError({
      networkError: new Error()
    })
  );

  /**
   * Given we are using the request password reset component
   */
  const { queryByText, getByText, getByLabelText } = render(ui);

  /**
   * Then we should not see error message
   */
  expect(queryByText(networkErrorText)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillForm(getByText, getByLabelText);

  /**
   * Then we should see error message
   */
  const $elm = await waitForElement(() => {
    return getByText(networkErrorText);
  });

  expect($elm).toBeInTheDocument();
});

it("redirects to login", async () => {
  const { ui, mockRequestPasswordReset, mockNavigate } = setUp();

  const result = {
    data: { requestPasswordReset: "token" }
  } as RequestPasswordResetResolved;

  mockRequestPasswordReset.mockResolvedValue(result);

  /**
   * Given we are using the request password reset component
   */
  const { getByText, getByLabelText, getByTestId } = render(ui);

  /**
   * And we complete and submit the form
   */
  fillForm(getByText, getByLabelText);

  /**
   * Then we should see an icon to close the instruction
   */
  const $elm = await waitForElement(() => getByTestId(toLoginIconTestId));

  /**
   * When we click on the close icon
   */
  fireEvent.click($elm);

  /**
   * Then we should be redirected to login page
   */
  expect(mockNavigate).toBeCalledWith(LOGIN_PATH);
});

function setUp() {
  const { Ui, ...rest } = renderWithRouter(RequestPasswordResetP);
  const mockRequestPasswordReset = jest.fn();

  return {
    mockRequestPasswordReset,
    ui: <Ui requestPasswordReset={mockRequestPasswordReset} />,
    ...rest
  };
}

function fillForm(getByText: any, getByLabelText: any, email = "a@b.com") {
  fillField(getByLabelText("Email"), email);
  fireEvent.click(getByText(resetPasswordRequestBtnText));
}
