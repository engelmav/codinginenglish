const dc = (tagValue) => `[data-cy="${tagValue}"]`;
const testEmail = "support@codinginenglish.com";

describe("RegistrationPage Actions", () => {
  context("iPhone 5 resolution", () => {
    beforeEach(() => {
      cy.viewport(320, 568);
    });
    describe("When you visit the Registration page", () => {
      it("Should open the Registration", () => {
        cy.visit("/apply");
      });
      describe("When you fill out the form", () => {
        it("Should send the form", () => {
          cy.get('[data-cy="email-input"]').type(`${testEmail}{enter}`);
          cy.get(dc`curric-confirmation-text`).should(
            "contain.text",
            testEmail
          );
          cy.get(dc`close-modal-btn`).click();
        });
      });
    });
  });
});
