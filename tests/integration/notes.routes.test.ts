import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app'; // O la función helper que arma la app en tu proyecto

describe('Rutas HTTP de Notas - tests de integración', () => {
    let app: any;

    beforeEach(() => {
        app = makeApp(':memory:');
    });
    
    describe('GET /notes/:id (Ejercicio 3)', () => {
        it('devolver status 200 y la nota si el ID existe', async () => {
        const createRes = await request(app)
            .post('/notes')
            .send({ title: 'Nota de integración', content: 'Probando GET' });

        const noteId = createRes.body.id;

        const response = await request(app).get(`/notes/${noteId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(noteId);
        expect(response.body.title).toBe('Nota de integración');
        });

        it('devolver status 404 si el ID no existe', async () => {
        const response = await request(app).get('/notes/999');

        expect(response.status).toBe(404);
        });
    });

    describe('PATCH /notes/:id (Ejercicio 4)', () => {
        it('espera a actualizar la nota y devolver status 200', async () => {
        const createRes = await request(app)
            .post('/notes')
            .send({ title: 'Título Original', content: 'Contenido Viejo' });

        const noteId = createRes.body.id;

        const response = await request(app)
            .patch(`/notes/${noteId}`)
            .send({ content: 'Contenido Nuevo Modificado' });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Título Original');
        expect(response.body.content).toBe('Contenido Nuevo Modificado');
        });

        it('devolver status 404 not found si se intenta actualizar un ID inexistente', async () => {
            const response = await request(app)
            .patch('/notes/999')
            .send({ title: 'Nuevo Título' });

            expect(response.status).toBe(404);
        });
    });
});