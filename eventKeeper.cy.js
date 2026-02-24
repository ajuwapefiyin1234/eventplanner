/* What beforeEach Means

Think of beforeEach as:

“Before every single test runs, do this first.”

So if you have 5 tests inside describe, this code runs 5 times — once before each test.

It prepares a clean environment.

🚀 Line by Line Explanation
1️⃣ cy.visit("http://localhost:5500/index.html");

This tells Cypress:

Open my Event Keeper app in the browser.

So before every test, it loads your webpage fresh.

2️⃣ cy.window()

This gives you access to the browser’s window object.

The window object controls things like:

localStorage

sessionStorage

alerts

global variables

3️⃣ .then((win) => {

This says:

When Cypress gets the window, call it win and let me use it.

So now win = the browser window.

4️⃣ win.localStorage.clear();

This deletes EVERYTHING stored in localStorage.

Why?

Because your app saves events in localStorage.

If you don’t clear it:

One test could affect another

Events from previous tests would still be there

Your tests might fail randomly*/




describe("Event Keeper App", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5500/index.html");

    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it("adds a new event", () => {
    cy.get("#title").type("Workshop");
    cy.get("#date").type("2026-07-01");
    cy.get("#desc").type("Coding practice");

    cy.contains("Add Event").click();

    cy.contains("Workshop").should("exist");
  });

  it("adds multiple events", () => {
    cy.get("#title").type("Event One");
    cy.get("#date").type("2026-08-01");
    cy.get("#desc").type("First");
    cy.contains("Add Event").click();

    cy.get("#title").type("Event Two");
    cy.get("#date").type("2026-09-01");
    cy.get("#desc").type("Second");
    cy.contains("Add Event").click();

    cy.contains("Event One").should("exist");
    cy.contains("Event Two").should("exist");
  });

  it("clears input fields after submission", () => {
    cy.get("#title").type("Conference");
    cy.get("#date").type("2026-06-10");
    cy.get("#desc").type("Tech talk");

    cy.contains("Add Event").click();

    cy.get("#title").should("have.value", "");
    cy.get("#date").should("have.value", "");
    cy.get("#desc").should("have.value", "");
  });

  it("saves events in localStorage", () => {
    cy.get("#title").type("Saved Event");
    cy.get("#date").type("2026-10-10");
    cy.get("#desc").type("Stored");

    cy.contains("Add Event").click();

    cy.window().then((win) => {
      const stored = JSON.parse(win.localStorage.getItem("events"));
      expect(stored.length).to.equal(1);
      expect(stored[0].title).to.equal("Saved Event");
    });
  });

  it("keeps events after page reload", () => {

    cy.get("#title").type("Persistent Event");
    cy.get("#date").type("2026-11-01");
    cy.get("#desc").type("Reload test");

    cy.contains("Add Event").click();

    cy.contains(".event", "Persistent Event").should("exist");

    cy.reload();

    cy.contains(".event", "Persistent Event").should("exist");

    cy.window().then((win) => {
      const stored = JSON.parse(win.localStorage.getItem("events"));
      expect(stored).to.have.length(1);
      expect(stored[0].title).to.equal("Persistent Event");
    });

  });

it("does not add event if title is empty", () => {

  cy.get("#date").type("2026-07-01");
  cy.get("#desc").type("Missing title");

  // Listen for alert
  cy.on("window:alert", (text) => {
    expect(text).to.contains("Fill all fields!");
  });

  cy.contains("Add Event").click();

  // Make sure no event was added
  cy.get(".event").should("not.exist");

});

it("does not add event if date is empty", () => {

  // Fill only title and description (leave date empty)
  cy.get("#title").type("No Date Event");
  cy.get("#desc").type("Date is missing");

  // Listen for the alert message
  cy.on("window:alert", (text) => {
    expect(text).to.equal("Fill all fields!");
  });

  // Click Add Event
  cy.contains("Add Event").click();

  // Make sure no event was added to the page
  cy.get(".event").should("not.exist");

  // Make sure nothing was saved in localStorage
  cy.window().then((win) => {
    const stored = JSON.parse(win.localStorage.getItem("events"));
    expect(stored).to.be.null; 
  });

});

});
