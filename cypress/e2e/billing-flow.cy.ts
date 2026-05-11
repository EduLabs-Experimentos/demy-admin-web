describe('Billing Flow - Desktop', () => {
  const BASE_URL = 'http://localhost:4200';
  const API_URL  = 'http://localhost:8080/api/v1';

  const timestamp = Date.now().toString();
  const uniqueEmail = `admin_${timestamp}@nistra.com`;
  let token: string;

  const mockInvoice = {
    id: 10,
    invoiceType: 'STUDENT_MONTHLY_FEE',
    amount: '500.00',
    currency: 'PEN',
    description: 'Pensión Mayo',
    issueDate: '2026-05-01',
    dueDate: '2026-05-31',
    status: 'PENDING'
  };

  const mockAccount = {
    id: 1,
    studentId: 100,
    dniNumber: '12345678',
    academyId: 1,
    invoices: [mockInvoice]
  };

  const mockAccountPaid = {
    ...mockAccount,
    invoices: [{ ...mockInvoice, status: 'PAID' }]
  };

  const mockAccountEmpty = {
    ...mockAccount,
    invoices: []
  };

  before(() => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/authentication/sign-up`,
      body: {
        emailAddress: uniqueEmail,
        password: 'Password123!',
        termsAndConditions: true
      },
      failOnStatusCode: false
    }).then(() => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/authentication/sign-in`,
        body: {
          emailAddress: uniqueEmail,
          password: 'Password123!'
        }
      }).then(res => {
        token = res.body.token;
      });
    });
  });

  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/billing-accounts`, [mockAccount]).as('getAccounts');

    cy.window().then(win => {
      win.localStorage.setItem('token', token);
    });

    cy.visit(`${BASE_URL}/billing`);
    cy.wait('@getAccounts');
  });

  it('searches by DNI and shows the billing account card', () => {
    cy.get('#studentDni').type('12345678');
    cy.get('.search-student-button').click();
    cy.get('.billing-account-card').should('be.visible');
    cy.get('.invoice-row').should('have.length', 1);
    cy.get('.status-badge').should('contain', 'PENDING');
  });

  it('assigns a new invoice and receives HTTP 201', () => {
    cy.intercept('POST', `${API_URL}/billing-accounts/*/invoices`, {
      statusCode: 201,
      body: {
        ...mockAccount,
        invoices: [
          mockInvoice,
          {
            id: 11,
            invoiceType: 'STUDENT_ENROLLMENT',
            amount: '200.00',
            currency: 'PEN',
            description: 'Matrícula 2026',
            issueDate: '2026-05-10',
            dueDate: '2026-06-01',
            status: 'PENDING'
          }
        ]
      }
    }).as('assignInvoice');

    cy.get('#studentDni').type('12345678');
    cy.get('.search-student-button').click();
    cy.get('.billing-account-card').should('be.visible');

    cy.get('#invoiceType').select('Matrícula');
    cy.get('#invoiceAmount').type('200');
    cy.get('#invoiceDescription').type('Matrícula 2026');
    cy.get('#invoiceDueDate').type('2026-06-01');
    cy.get('.assign-invoice-button').click();

    cy.wait('@assignInvoice').its('response.statusCode').should('eq', 201);
    cy.get('.success-message').should('be.visible');
  });

  it('marks an invoice as paid via confirm dialog and receives HTTP 200', () => {
    const paidInvoice = { ...mockInvoice, status: 'PAID' };
    cy.intercept('POST', `${API_URL}/billing-accounts/*/invoices/*/mark-as-paid`, {
      statusCode: 200,
      body: paidInvoice
    }).as('markAsPaid');

    cy.get('#studentDni').type('12345678');
    cy.get('.search-student-button').click();
    cy.get('.billing-account-card').should('be.visible');

    cy.get('.mark-paid-button').first().click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.confirm-button').click();

    cy.wait('@markAsPaid').its('response.statusCode').should('eq', 200);
    cy.get('.success-message').should('be.visible');
  });

  it('deletes an invoice via confirm dialog and receives HTTP 204', () => {
    cy.intercept('DELETE', `${API_URL}/billing-accounts/*/invoices/*`, {
      statusCode: 204,
      body: null
    }).as('deleteInvoice');

    cy.get('#studentDni').type('12345678');
    cy.get('.search-student-button').click();
    cy.get('.billing-account-card').should('be.visible');

    cy.get('.delete-invoice-button').first().click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.confirm-button').click();

    cy.wait('@deleteInvoice').its('response.statusCode').should('eq', 204);
    cy.get('.success-message').should('be.visible');
  });

  it('shows error when DNI not found', () => {
    cy.get('#studentDni').type('99999999');
    cy.get('.search-student-button').click();
    cy.get('.error-message').should('be.visible');
    cy.get('.billing-account-card').should('not.exist');
  });

  it('cancels confirm dialog without performing action', () => {
    cy.get('#studentDni').type('12345678');
    cy.get('.search-student-button').click();
    cy.get('.billing-account-card').should('be.visible');

    cy.get('.delete-invoice-button').first().click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.cancel-button').click();
    cy.get('.confirm-dialog').should('not.exist');
    cy.get('.invoice-row').should('have.length', 1);
  });
});
