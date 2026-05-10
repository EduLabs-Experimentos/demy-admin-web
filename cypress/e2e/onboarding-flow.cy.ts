describe('E2E Puro: Flujo de Onboarding Real', () => {

  //Arrange
  // Creamos variables dinámicas únicas basadas en la hora exacta
  const timestamp = Date.now().toString();
  const uniqueEmail = `admin_${timestamp}@nistra.com`;
  const uniqueDni = timestamp.slice(-8); // Tomamos los últimos 8 dígitos
  const uniqueRuc = `10${timestamp.slice(-9)}`; // Un RUC válido de 11 dígitos

  beforeEach(() => {
    // Creamos el usuario directamente pegándole en la API real
    // Esto asegura que el usuario sea nuevo en cada prueba, evitando el error de "ya tiene academia", asegurando que sea una prueba E2E
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/authentication/sign-up',
      body: {
        emailAddress: uniqueEmail,
        password: 'Password123!',
        termsAndConditions: true
      },
      failOnStatusCode: false
    }).then((response) => {
      // Como el sistema pide verificar código, idealmente para entornos E2E
      // se desactiva esa validación o el endpoint nos devuelve el código.

      // Iniciamos sesión con el usuario recién creado
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/authentication/sign-in',
        body: {
          emailAddress: uniqueEmail,
          password: 'Password123!'
        }
      }).then((signInRes) => {
        // Guardamos el token REAL y el userId REAL en el navegador
        cy.window().then((win) => {
          win.localStorage.setItem('token', signInRes.body.token);
          win.localStorage.setItem('userId', signInRes.body.id.toString());
        });
      });
    });

    // Vamos a la pantalla de completar perfil
    cy.visit('http://localhost:4200/complete-account');
  });

  it('Debería crear el administrador y la academia en la BD real con datos dinámicos', () => {

    // == Registrar administrador ===

    // Arrange
    cy.intercept('POST', '**/api/v1/administrators*').as('registerAdmin');

    //Act
    cy.get('#firstName').type('Admin');
    cy.get('#lastName').type('Dinamico');
    cy.get('#countryCode').clear().type('+51');
    cy.get('#phone').type('999888777');
    cy.get('#dniNumber').type(uniqueDni);
    cy.get('.submit-button').click({ force: true });

    // Assert
    cy.wait('@registerAdmin').its('response.statusCode').should('eq', 201); // Afirmar BD
    cy.url().should('include', '/setup-academy'); // Afirmar UI/Navegación


    // === Registrar una academia ===

    // Arrange
    cy.intercept('POST', '**/api/v1/academies*').as('registerAcademy');

    // Act
    cy.get('#academyName').type(`Academia ${timestamp}`);
    cy.get('#academyDescription').type('Plataforma E2E Real');
    cy.get('#ruc').type(uniqueRuc);
    cy.get('#street').type('Av. Automatización 404');
    cy.get('#district').type('Villa El Salvador');
    cy.get('#province').type('Lima');
    cy.get('#department').type('Lima');
    cy.get('#emailAddress').type(`contacto_${timestamp}@demy.com`);
    cy.get('#countryCode').clear().type('+51');
    cy.get('#phone').type('987654321');
    cy.get('.submit-button').click({ force: true });

    // Assert
    cy.wait('@registerAcademy').its('response.statusCode').should('eq', 201); // Afirmar BD
    cy.url().should('include', '/home'); // Afirmar UI/Navegación
  });
});
