import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock del servicio de API para evitar problemas con axios
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    getCandidatos: jest.fn().mockResolvedValue({
      success: true,
      data: [],
      message: 'Candidatos obtenidos exitosamente'
    }),
    createCandidato: jest.fn(),
    updateCandidato: jest.fn(),
    deleteCandidato: jest.fn(),
    getCandidatoById: jest.fn(),
    healthCheck: jest.fn()
  }
}));

// Mock de react-toastify para evitar problemas con CSS
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  }
}));

// Importar App después de los mocks
const App = require('../App').default;

test('renders ATS system title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Sistema ATS/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders add candidate button when form is not shown', () => {
  render(<App />);
  const addButton = screen.getByText(/Añadir Candidato/i);
  expect(addButton).toBeInTheDocument();
});

test('renders toast container', () => {
  render(<App />);
  const toastContainer = screen.getByTestId('toast-container');
  expect(toastContainer).toBeInTheDocument();
});
