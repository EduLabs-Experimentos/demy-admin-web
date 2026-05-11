describe('E2E: Gestión de Profesores (Teacher)', () => {

  beforeEach(() => {
    // Login (Se usa los selectores del componente sign-in)
    cy.visit('http://localhost:4200/sign-in');
    cy.get('#email').type('diegovilcatut@gmail.com');
    cy.get('#password').type('Sofiamia');
    cy.get('.submit-button').click();

    // Esperamos a que inicie sesión y luego vamos a profesores
    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.visit('http://localhost:4200/teachers');
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
