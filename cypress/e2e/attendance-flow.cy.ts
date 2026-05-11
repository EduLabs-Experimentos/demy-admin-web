describe('Attendance Flow - Desktop', () => {
  const BASE_URL = 'http://localhost:4200';
  const API_URL  = 'http://localhost:8080/api/v1';

  const timestamp = Date.now().toString();
  const uniqueEmail = `admin_${timestamp}@nistra.com`;
  let token: string;

  const mockAttendances = [
    {
      id: 1,
      classSessionId: 1,
      date: '2026-05-10',
      attendance: [{ dni: '12345678', status: 'ABSENT' }]
    }
  ];

  const mockUpdated = {
    id: 1,
    classSessionId: 1,
    date: '2026-05-10',
    attendance: [{ dni: '12345678', status: 'PRESENT' }]
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

  it('marks a student PRESENT via UI and confirms HTTP 200', () => {
    cy.intercept('GET', `${API_URL}/class-attendances/all`, mockAttendances).as('getAttendances');
    cy.intercept('PATCH', `${API_URL}/class-attendances/*/attendance/*/status`, {
      statusCode: 200,
      body: mockUpdated
    }).as('patchAttendance');

    cy.window().then(win => {
      win.localStorage.setItem('token', token);
    });

    cy.visit(`${BASE_URL}/attendance`);
    cy.wait('@getAttendances');

    cy.get('[data-cy="session-selector"]').select('Session 1');
    cy.get('[data-cy="mark-present-12345678"]').click();

    cy.wait('@patchAttendance').its('response.statusCode').should('eq', 200);
    cy.get('[data-cy="success-toast"]').should('be.visible');
  });

  it('shows validation error when no session is selected', () => {
    cy.intercept('GET', `${API_URL}/class-attendances/all`, mockAttendances).as('getAttendances');

    cy.window().then(win => {
      win.localStorage.setItem('token', token);
    });

    cy.visit(`${BASE_URL}/attendance`);
    cy.wait('@getAttendances');

    cy.get('[data-cy="submit-attendance"]').click();
    cy.get('[data-cy="session-error"]').should('contain', 'session');
  });
});
