/**
 * Test JavaScript básico sin TypeScript
 * Para aislar si el problema es con ts-jest
 */

describe('Basic JavaScript Test', () => {
  test('should work without TypeScript', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
  });

  test('should work with basic DOM', () => {
    const div = document.createElement('div');
    div.textContent = 'Test';
    expect(div.textContent).toBe('Test');
  });
}); 