import { describe, it, expect, beforeEach } from 'vitest';
import { createDb } from '../../src/db/connection';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { NoteServiceImpl } from '../../src/services/NoteService';

describe('NoteService - updateNote (Ejercicio 4)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
    });

    it('actualizar campos de una nota existente', () => {
        const created = service.createNote({ title: 'Original', content: 'Contenido original' });

        const updated = service.updateNote(created.id, { content: 'Contenido editado' });

        expect(updated).toBeDefined();
        expect(updated?.id).toBe(created.id);
        expect(updated?.title).toBe('Original');
        expect(updated?.content).toBe('Contenido editado');
    });

    it('retornar undefined si el id a actualizar no existe', () => {
        const updated = service.updateNote(999, { title: 'Nuevo título' });
        
        expect(updated).toBeUndefined();
    });
});