/**
 * Test mínimo para aislar el problema de jsdom
 * Este test no depende de React ni de ningún componente complejo
 */

describe('Minimal Test', () => {
  test('should work with basic jsdom', () => {
    // Crear un elemento DOM básico
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    
    // Verificar que jsdom funciona
    expect(div.textContent).toBe('Hello World');
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  test('should handle basic DOM operations', () => {
    // Agregar elemento al DOM
    const container = document.createElement('div');
    const child = document.createElement('span');
    child.textContent = 'Test';
    container.appendChild(child);
    
    // Verificar operaciones DOM
    expect(container.children.length).toBe(1);
    expect(container.firstChild?.textContent).toBe('Test');
  });
});

// Hacer que el archivo sea considerado un módulo TypeScript
export {}; 