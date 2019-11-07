
describe("Appointments", () => {
  beforeEach(() => {
    // Reset the test database
    cy.request("GET", "api/debug/reset")

    // Visits the root of our web server
    cy.visit("/");

    // Make sure page data is loaded before continuing to next step
    cy.contains("Monday");
  })

  it("should book an interview", () => {
    // Clicks on the "Add" button in the second appointment
    cy.get('[alt="Add"]').first().click();

    // Enters their name
    cy.get('[placeholder="Enter Student Name"]').type("Lydia Miller-Jones");

    // Chooses an interviewer
    cy.get('[alt="Sylvia Palmer"]').click();

    // Clicks the save button
    cy.contains("Save").click();

    // Sees the booked appointment
    cy.contains('.appointment__card--show', "Lydia Miller-Jones");
    cy.contains('.appointment__card--show', "Sylvia Palmer");
  })

  it("should edit an interview", () => {
    // Clicks the edit button for the existing appointment
    cy.get('[alt="Edit"]').first().click({ force: true });

    // Changes the name and interviewer
    cy.get('[placeholder="Enter Student Name"]').clear().type("Ya Girl");
    cy.get('[alt="Tori Malcolm"]').click();

    // Clicks the save button
    cy.contains("Save").click();

    // Sees the edit to the appointment
    cy.contains('.appointment__card--show', "Ya Girl");
    cy.contains('.appointment__card--show', "Tori Malcolm");
  })

  it("should cancel an existing interview", () => {
    // Clicks the delete button for the existing appointment
    cy.get('[alt="Delete"]').first().click({ force: true });

    // Clicks the confirm button
    cy.contains("Confirm").click();

    // Check that the "Deleting" indicator should exist. 
    cy.contains("Deleting").should('exist');

    // Then check that the "Deleting" indicator should not exist. 
    cy.contains("Deleting").should('not.exist');

    // Last check that the element that contains the text "Archie Cohen" should not exist.
    cy.contains('.appointment__card--show', "Archie Cohen").should('not.exist');
  })
})