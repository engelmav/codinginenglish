const dc = (tagValue) => `[data-cy="${tagValue}"]`;
const testEmail = "support@codinginenglish.com";

describe("LandingPage Actions", () => {
  context("iPhone 5 resolution", () => {
    beforeEach(() => {
      cy.viewport(320, 568);
    });
    describe("When you visit home", () => {
      it("Should open the LandingPage", () => {
        cy.visit("/");
      });
      describe("When you click 'Send me the curriculum", () => {
        it("Should open the curriculum modal and send it to you", () => {
          cy.get('[data-cy="hero-curric-btn"]').click();
          cy.get('[data-cy="email-input"]').type(`${testEmail}{enter}`);
          cy.get(dc`curric-confirmation-text`).should(
            "contain.text",
            testEmail
          );
          cy.get(dc`close-modal-btn`).click();
        });
      });
    });
    describe("When you click 'Sign up'", () => {
      it("Should go to the RegistrationPage (/apply)", () => {
        cy.get('[data-cy="hero-reg-btn"]').click();
      });
    });
  });
});
