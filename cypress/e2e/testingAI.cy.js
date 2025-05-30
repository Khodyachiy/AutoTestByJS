
describe('Test with backend', () => {

  beforeEach('login to application', () => {
    cy.loginToApplication()
  })

 
  it.only('verify correct request and response', () => {
    // Intercepting the request to create an article
    cy.intercept('POST', /\/api\/articles\//).as('postArticles');

    // Click to "Next Article" button
    cy.contains('New Article').click();

    // Filling in the fields of form
    cy.get('[formcontrolname="title"]').type('This is the title');
    cy.get('[formcontrolname="description"]').type('This is a description');
    cy.get('[formcontrolname="body"]').type('This is a body of the article');

    // Click to "Publish Article" button
    cy.contains('Publish Article').click();

    // Waiting the end of request
    cy.wait('@postArticles').then((xhr) => {
      // Logs the request and response
      cy.log('Request:', xhr.request);
      cy.log('Response:', xhr.response);

      // Checks the status of response
      expect(xhr.response.statusCode).to.equal(201);

      // Checks body of request
      expect(xhr.request.body.article).to.have.property('body', 'This is a body of the article');

      // Checks body of response
      expect(xhr.response.body.article).to.have.property('description', 'This is a description');
    })
  })

})