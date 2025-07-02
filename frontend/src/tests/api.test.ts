/**
 * Tests para el servicio de API
 * Valida el manejo de errores con fieldErrors
 */
import apiService from '../services/api';

// Mock de axios para simular respuestas de error
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

describe('API Service Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle fieldErrors in validation errors', async () => {
    // Simular error de validación con fieldErrors
    const mockError = {
      response: {
        status: 400,
        data: {
          success: false,
          message: 'Datos de entrada inválidos',
          error: 'Validación fallida',
          fieldErrors: {
            nombre: 'El nombre no puede estar vacío',
            email: 'El formato del email no es válido',
            telefono: 'El teléfono no puede exceder 20 caracteres'
          }
        }
      }
    };

    // Mock del método put para que lance el error
    const mockPut = jest.fn().mockRejectedValue(mockError);
    (apiService as any).api.put = mockPut;

    try {
      await apiService.updateCandidato('DOC123', { documento: 'DOC123', nombre: '', email: 'invalid' });
    } catch (error: any) {
      expect(error.message).toBe('Datos de entrada inválidos');
      expect(error.fieldErrors).toBeDefined();
      expect(error.fieldErrors.nombre).toBe('El nombre no puede estar vacío');
      expect(error.fieldErrors.email).toBe('El formato del email no es válido');
      expect(error.fieldErrors.telefono).toBe('El teléfono no puede exceder 20 caracteres');
    }
  });

  test('should handle regular errors without fieldErrors', async () => {
    // Simular error regular sin fieldErrors
    const mockError = {
      response: {
        status: 500,
        data: {
          success: false,
          message: 'Error interno del servidor',
          error: 'Error interno'
        }
      }
    };

    // Mock del método put para que lance el error
    const mockPut = jest.fn().mockRejectedValue(mockError);
    (apiService as any).api.put = mockPut;

    try {
      await apiService.updateCandidato('DOC123', { documento: 'DOC123', nombre: 'Test' });
    } catch (error: any) {
      expect(error.message).toBe('Error interno del servidor');
      expect(error.fieldErrors).toBeUndefined();
    }
  });
}); 