describe('Registro de usuario', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('deberia registrar un nuevo usuario correctamente', () => {
    cy.visit('http://localhost:3000');

    // Abrimos el modal de registro
    cy.get('#btn-registrarse').click();

    // Generamos un email único para no chocar con registros anteriores
    const emailUnico = `paciente_${Date.now()}@test.com`;

    // ---- Paso 0: Cuenta ----
    cy.contains('Crear cuenta').should('be.visible');
    cy.get('#registro-usuario').type(emailUnico);
    cy.get('#registro-password').type('Password123!');
    cy.get('#registro-confirmar-password').type('Password123!');
    cy.contains('button', 'Siguiente').click();

    // ---- Paso 1: Datos Personales ----
    cy.contains('Datos Personales').should('be.visible');
    cy.get('#registro-nombre').type('Juan Pérez');
    cy.get('#registro-dni').type('30111222');
    cy.contains('button', 'Siguiente').click();

    // ---- Paso 2: Cobertura (Opcional) — la salteamos ----
    cy.contains('Cobertura').should('be.visible');
    cy.get('#btn-confirmar-registro').should('not.be.disabled').click();

    // ---- Verificación final ----
    // Un registro exitoso redirige a /mi-perfil (según Header.jsx)
    cy.url().should('include', '/mi-perfil');
  })
})