describe('E2E: Gestión de Profesores (Teacher)', () => {

  beforeEach(() => {
    const timestamp = Date.now().toString();
    const uniqueEmail = `teacher_${timestamp}@nistra.com`;
    const uniqueDni = timestamp.slice(-8);
    const uniqueRuc = `10${timestamp.slice(-9)}`;

    // Crear usuario vía API
    cy.request({
      method: 'POST',
      url: 'https://demy-app-backend-eygre7eda5g3hkfh.southeastasia-01.azurewebsites.net/api/v1/authentication/sign-up',
      body: { emailAddress: uniqueEmail, password: 'Password123!', termsAndConditions: true },
      failOnStatusCode: false
    }).then(() => {
      // Iniciar sesión y obtener token
      cy.request({
        method: 'POST',
        url: 'https://demy-app-backend-eygre7eda5g3hkfh.southeastasia-01.azurewebsites.net/api/v1/authentication/sign-in',
        body: { emailAddress: uniqueEmail, password: 'Password123!' }
      }).then((signInRes) => {
        const token = signInRes.body.token;
        const userId = signInRes.body.id;

        cy.window().then((win) => {
          win.localStorage.setItem('token', token);
          win.localStorage.setItem('userId', userId.toString());
        });

        // Registrar administrador vía API
        cy.request({
          method: 'POST',
          url: 'https://demy-app-backend-eygre7eda5g3hkfh.southeastasia-01.azurewebsites.net/api/v1/administrators',
          body: { firstName: 'Admin', lastName: 'Test', countryCode: '+51', phone: '999888777', dniNumber: uniqueDni, userId },
          headers: { Authorization: `Bearer ${token}` }
        }).then((adminRes) => {
          const adminId = adminRes.body.id;

          cy.window().then((win) => {
            win.localStorage.setItem('adminId', adminId.toString());
          });

          // Registrar academia vía API
          cy.request({
            method: 'POST',
            url: 'https://demy-app-backend-eygre7eda5g3hkfh.southeastasia-01.azurewebsites.net/api/v1/academies',
            body: { academyName: `Academia ${timestamp}`, academyDescription: 'E2E Test', ruc: uniqueRuc, street: 'Av. Test 123', district: 'Lima', province: 'Lima', department: 'Lima', emailAddress: `contacto_${timestamp}@demy.com`, countryCode: '+51', phone: '987654321', administratorId: adminId },
            headers: { Authorization: `Bearer ${token}` }
          }).then((academyRes) => {
            const academyId = academyRes.body.id;

            cy.window().then((win) => {
              win.localStorage.setItem('academyId', academyId.toString());
            });

            // Ir a la página de profesores
            cy.visit('http://localhost:4200/teachers');
          });
        });
      });
    });
  });

  it('Debería registrar un nuevo profesor y mostrarlo en la tabla', () => {
    // Arrange
    cy.intercept('POST', '**/api/v1/teachers*').as('registerTeacher');

    // Generamos un sello de tiempo único para esta ejecución
    const timestamp = Date.now().toString();
    const uniqueEmail = `carlos_${timestamp}@nistra.com`;
    const uniquePhone = `9${timestamp.slice(-8)}`; // Teléfono de 9 dígitos único

    // Act

    // 1. Llenamos el formulario con los datos dinámicos
    cy.get('#teacher-firstName').type('Carlos');
    cy.get('#teacher-lastName').type('Mendoza');
    cy.get('#teacher-emailAddress').type(uniqueEmail); // Usamos el correo único
    cy.get('#teacher-phone').type(uniquePhone);        // Usamos el teléfono único

    //  Hacemos clic en el botón
    cy.get('.teacher-form__submit').click();

    // Assert

    // Validamos la creación en el Backend (¡Ahora sí devolverá 201 siempre!)
    cy.wait('@registerTeacher').its('response.statusCode').should('eq', 201);

    // Validamos que la tabla contiene los datos generados
    cy.get('.teacher-roster').should('contain.text', 'Carlos Mendoza');
    cy.get('.teacher-roster').should('contain.text', uniqueEmail);
  });

  it('Debería mostrar tus errores personalizados si los datos son inválidos', () => {

    // Arrange (la preparación ya se hizo en el before each)

    //Act
    // Ingresamos datos que rompan las validaciones
    cy.get('#teacher-firstName').type('Carlos123');
    cy.get('#teacher-emailAddress').type('correo-sin-arroba');
    cy.get('#teacher-phone').type('123');

    //Assert
    // Validamos que Angular aplique clase CSS para bordes rojos
    cy.get('#teacher-firstName').should('have.class', 'teacher-form__input--invalid');
    cy.get('#teacher-emailAddress').should('have.class', 'teacher-form__input--invalid');
    cy.get('#teacher-phone').should('have.class', 'teacher-form__input--invalid');

    // Validamos que los mensajes de texto pequeños aparezcan en pantalla
    cy.get('.teacher-form__error-text').should('contain.text', 'Solo letras y espacios');
    cy.get('.teacher-form__error-text').should('contain.text', 'Email inválido');
    cy.get('.teacher-form__error-text').should('contain.text', 'Debe tener 9 dígitos');
  });
});
