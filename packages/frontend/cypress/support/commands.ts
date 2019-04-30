import "cypress-testing-library/add-commands";
import "cypress-file-upload";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       *
       */
      startSession: () => Chainable<Promise<void>>;

      stopSession: () => Chainable<Promise<void>>;
    }
  }
}

/**
 * So why don't we call cy.task directly from test and have to go through
 * commands?
 *
 * cy.task is an implementation detail which our tests should not care about.
 * We use cy.task now because our backend is written in javascript and we can
 * directly call backend code from frontend.
 * Imagine if in the future we switch backend language and the only way to
 * start and stop the session is by making
 * an http request (because we can not call backend code directly)
 */
Cypress.Commands.add("startSession", () => {
  cy.task("createConnection");
});

Cypress.Commands.add("stopSession", () => {
  cy.task("closeConnection");
});
