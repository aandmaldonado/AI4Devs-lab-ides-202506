import request from 'supertest';
import { app } from '../index';
import { Request, Response, NextFunction } from 'express'; // Import the necessary types

describe('GET /', () => {
    it('responds with API status JSON', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'API del Sistema ATS funcionando correctamente');
        expect(response.body).toHaveProperty('version');
        expect(response.body).toHaveProperty('timestamp');
    });
});

describe('POST /api/candidatos', () => {
    it('should return field-specific errors for invalid data', async () => {
        const invalidData = {
            nombre: '', // Campo vacío
            apellido: 'a'.repeat(101), // Demasiado largo
            email: 'invalid-email', // Email inválido
            telefono: '123456789012345678901' // Demasiado largo
        };

        const response = await request(app)
            .post('/api/candidatos')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.fieldErrors).toBeDefined();
        expect(response.body.fieldErrors.nombre).toBeDefined();
        expect(response.body.fieldErrors.apellido).toBeDefined();
        expect(response.body.fieldErrors.email).toBeDefined();
        expect(response.body.fieldErrors.telefono).toBeDefined();
    });
});

describe('PUT /api/candidatos/:id', () => {
    it('should return field-specific errors for invalid update data', async () => {
        const invalidData = {
            nombre: '', // Campo vacío
            email: 'invalid-email', // Email inválido
            telefono: '123456789012345678901' // Demasiado largo
        };

        const response = await request(app)
            .put('/api/candidatos/1')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.fieldErrors).toBeDefined();
        expect(response.body.fieldErrors.nombre).toBeDefined();
        expect(response.body.fieldErrors.email).toBeDefined();
        expect(response.body.fieldErrors.telefono).toBeDefined();
    });
});
