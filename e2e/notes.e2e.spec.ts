import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

// EJERCICIO 7 — Flujo E2E completo contra el server real (puerto 4000).
// Antes de cada test la base queda con 2 notas sembradas:
//   "Comprar pan" y "Llamar al dentista" (esta última con pinned=true).

test.describe('Notes API - E2E (Ejercicio 7)', () => {
  test.beforeEach(async ({ baseURL }) => {
    await resetAndSeed(baseURL!);
  });

  test('happy path: crear, listar, leer, modificar y eliminar una nota', async ({ request }) => {
    // 1) Crear
    const createRes = await request.post('/notes', {
      data: { title: 'Nota E2E', content: 'Contenido inicial' }
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeDefined();
    expect(created.pinned).toBe(false);

    // 2) Listar: 2 sembradas + la nueva
    const listRes = await request.get('/notes');
    expect(listRes.status()).toBe(200);
    const list = await listRes.json();
    expect(list).toHaveLength(3);
    expect(list.map((n: { title: string }) => n.title)).toContain('Nota E2E');

    // 3) Leer por id
    const getRes = await request.get(`/notes/${created.id}`);
    expect(getRes.status()).toBe(200);
    expect((await getRes.json()).title).toBe('Nota E2E');

    // 4) Modificar (patch parcial: solo content)
    const patchRes = await request.patch(`/notes/${created.id}`, {
      data: { content: 'Contenido modificado' }
    });
    expect(patchRes.status()).toBe(200);
    const patched = await patchRes.json();
    expect(patched.title).toBe('Nota E2E');
    expect(patched.content).toBe('Contenido modificado');

    // 5) Eliminar
    const deleteRes = await request.delete(`/notes/${created.id}`);
    expect(deleteRes.status()).toBe(204);

    // 6) Ya no existe
    const afterDeleteRes = await request.get(`/notes/${created.id}`);
    expect(afterDeleteRes.status()).toBe(404);
  });

  test('caso de error: crear una nota inválida devuelve 400 y no persiste nada', async ({ request }) => {
    const res = await request.post('/notes', {
      data: { title: '', content: 'Sin título' }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('ValidationError');

    // Siguen existiendo solo las 2 notas sembradas
    const listRes = await request.get('/notes');
    expect(await listRes.json()).toHaveLength(2);
  });
});