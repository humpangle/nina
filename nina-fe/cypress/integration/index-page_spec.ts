import { SITE_TITLE } from "../../src/constants";

describe("index page", function() {
  it("loads successfully", function() {
    /**
     * Given a user is on the home page
     */
    cy.visit("/");

    /**
     * Then user should see the title
     */
    cy.title().should("eq", SITE_TITLE);
  });
});
