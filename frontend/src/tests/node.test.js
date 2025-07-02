/**
 * Test que funciona con jsdom (entorno por defecto de react-scripts)
 * Para confirmar que Jest funciona correctamente
 */

describe('JSDOM Environment Test', () => {
  test('should work with DOM', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect([1, 2, 3]).toHaveLength(3);
  });

  test('should have DOM objects available', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
    expect(document.createElement).toBeDefined();
  });

  test('should handle basic DOM operations', () => {
    const div = document.createElement('div');
    div.textContent = 'Test DOM';
    expect(div.textContent).toBe('Test DOM');
  });
}); 