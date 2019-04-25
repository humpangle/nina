import "cypress-testing-library/add-commands";
import "cypress-file-upload";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       *
       */
      checkoutSession: () => Chainable<Promise<void>>;

      closeSession: () => Chainable<Promise<void>>;
    }
  }
}
