import { LOGIN_TITLE, APP_WELCOME_TITLE } from "@nina/frontend/src/constants";
import { TEST_USER } from "../support/utils";
import {
  headerMenuToggleTestId,
  headerUiText
} from "../../src/components/Header/header";
import { LOGIN_PATH } from "../../src/routing";
import {
  loginFormLabels,
  loginSubmitButtonText,
  loginErrorTestId
} from "../../src/components/Login/login";

describe("Sign up page", function() {
  beforeEach(() => {
    cy.startSession();
  });

  afterEach(() => {
    cy.stopSession();
  });

  it("logins successfully and redirects to app page", function() {
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
    cy.getByText(headerUiText.menuTexts.logIn).click();

    /**
     * Then user should see the page title
     */
    cy.title().should("contain", LOGIN_TITLE);

    /**
     * When user fills and submits the form
     */

    cy.getByLabelText(loginFormLabels.usernameEmail).type(TEST_USER.username);

    cy.getByLabelText(loginFormLabels.password).type(TEST_USER.password);
    cy.getByText(loginSubmitButtonText).click();

    /**
     * Then user should be redirected to app page
     */
    cy.title().should("contain", APP_WELCOME_TITLE);
  });

  it("renders error if we input wrong password", function() {
    /**
     * Given there is already a user in the system
     */
    cy.createUser(TEST_USER);

    /**
     * And user visits the login page
     */
    cy.visit(LOGIN_PATH);

    /**
     * Then user should see the page title
     */
    cy.title().should("contain", LOGIN_TITLE);

    /**
     * When user fills username/email field
     */

    cy.getByLabelText(loginFormLabels.usernameEmail).type(TEST_USER.email);

    /**
     * And user fills password field with wrong password
     */
    cy.getByLabelText(loginFormLabels.password).type("a" + TEST_USER.password);

    /**
     * Then user should not see any error
     */
    cy.queryByTestId(loginErrorTestId).should("not.exist");

    /**
     * And user submits the form
     */
    cy.getByText(loginSubmitButtonText).click();

    /**
     * Then user should see error
     */
    cy.queryByTestId(loginErrorTestId).should("exist");
  });
});
