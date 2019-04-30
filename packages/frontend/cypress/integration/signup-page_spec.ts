import { APP_WELCOME_TITLE, SIGNUP_TITLE } from "@nina/frontend/src/constants";
import * as inputReg from "@nina/frontend/src/__tests__/utils-sign-up";
import { TEST_USER } from "../support/utils";
import {
  headerMenuToggleTestId,
  headerUiText
} from "../../src/components/Header/header";
import { makeSignupFormFieldErrorTestId } from "../../src/components/Signup/signup";

describe("Sign up page", function() {
  beforeEach(() => {
    cy.startSession();
  });

  afterEach(() => {
    cy.stopSession();
  });

  it("returns server error if we sign up with non unique username", function() {
    /**
     * Given there is already a user in the system
     */
    cy.createUser(TEST_USER);

    /**
     * And user visits the home page
     */
    cy.visit("/");

    /**
     * And user clicks the menu toggle icon
     */
    cy.getByTestId(headerMenuToggleTestId).click();

    /**
     * And user clicks on the sign up link
     */
    cy.getByText(headerUiText.menuTexts.signUp).click();

    /**
     * Then user should see the page title
     */
    cy.title().should("contain", SIGNUP_TITLE);

    /**
     * And user should not see any error on the page
     */
    const errorTestId = makeSignupFormFieldErrorTestId("username");
    cy.queryByTestId(errorTestId).should("not.exist");

    /**
     * When user fills the form with same user data as already in the system
     * and user submits the form
     */

    // just to make sure we only get error for username
    const userData = { ...TEST_USER, email: "a" + TEST_USER.email };
    cy.getByLabelText(inputReg.usernameInputReg).type(userData.username);
    cy.getByLabelText(inputReg.emailInputReg).type(userData.email);
    cy.getByLabelText(inputReg.passwordInputReg).type(userData.password);
    cy.getByLabelText(inputReg.repeatPasswordInputReg).type(userData.password);
    cy.getByText(inputReg.submitBtnTextReg).click();

    /**
     * Then user should see error on the page
     */
    cy.getByTestId(errorTestId).should("exist");
  });
});
