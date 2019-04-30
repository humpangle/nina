import { SITE_TITLE } from "@nina/frontend/src/constants";
import * as inputReg from "@nina/frontend/src/__tests__/utils-sign-up";
import { CreateUserInput } from "@nina/frontend/src/apollo-generated";

const TEST_USER: CreateUserInput = {
  username: "john",
  email: "a@b.com",
  password: "123456"
};

describe("index page", function() {
  beforeEach(() => {
    cy.startSession();
  });

  afterEach(() => {
    cy.stopSession();
  });

  it("loads successfully", function() {
    /**
     * Given a user is on the home page
     */
    cy.visit("/");

    /**
     * Then user should see the title
     */
    cy.title().should("eq", SITE_TITLE);

    /**
     * When user fills and submits the form
     */
    cy.getByLabelText(inputReg.usernameInputReg).type(TEST_USER.username);
    cy.getByLabelText(inputReg.emailInputReg).type(TEST_USER.email);
    cy.getByLabelText(inputReg.passwordInputReg).type(TEST_USER.password);
    cy.getByLabelText(inputReg.repeatPasswordInputReg).type(TEST_USER.password);
    cy.getByText(inputReg.submitBtnTextReg).click();

    /**
     * Then user should be redirected to the welcome page
     */
    cy.title().should("contain", "Welcome");
  });
});
