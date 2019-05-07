import { RESET_PASSWORD_TITLE } from "@nina/frontend/src/constants";
import { REQUEST_PASSWORD_RESET_PATH } from "../../src/routing";
import { TEST_USER } from "../support/utils";
import {
  resetPasswordRequestBtnText,
  resetPasswordRequestSuccess2,
  gqlErrorText
} from "../../src/components/RequestPasswordReset/request-password-reset";

describe("Request password reset page", function() {
  beforeEach(() => {
    cy.startSession();
  });

  afterEach(() => {
    cy.stopSession();
  });

  it("succeeds", function() {
    /**
     * Given a user exists in the system
     */
    cy.createUser(TEST_USER);

    /**
     * And we are on the password reset request page
     */
    cy.visit(REQUEST_PASSWORD_RESET_PATH);

    /**
     * Then we should see the title
     */
    cy.title().should("contain", RESET_PASSWORD_TITLE);

    /**
     * And we should not see instruction about sending email to user
     */
    const resetPasswordRequestSuccessRegexp = new RegExp(
      resetPasswordRequestSuccess2,
      "i"
    );
    cy.queryByText(resetPasswordRequestSuccessRegexp).should("not.exist");

    /**
     * When we fill and submit the form
     */
    cy.getByLabelText("Email").type(TEST_USER.email);
    cy.getByText(resetPasswordRequestBtnText).click();

    /**
     * Then we should see follow on instructions
     */
    cy.getByText(resetPasswordRequestSuccessRegexp).should("exist");
  });

  it.skip("fails if user does not exist", function() {
    /**
     * Given we are on the password reset request page
     */
    cy.visit(REQUEST_PASSWORD_RESET_PATH);

    /**
     * And we should not error message
     */

    cy.queryByText(gqlErrorText).should("not.exist");

    /**
     * When we fill and submit the form
     */
    cy.getByLabelText("Email").type(TEST_USER.email);
    cy.getByText(resetPasswordRequestBtnText).click();

    /**
     * Then we should see error message
     */
    cy.getByText(gqlErrorText).should("exist");
  });
});
