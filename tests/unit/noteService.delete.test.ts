import { describe, it, expect, beforeEach } from 'vitest';
import { createDb } from '../../src/db/connection';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { NoteServiceImpl } from '../../src/services/NoteService';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('elimina una nota existente y devuelve true', () => {
        const created = service.createNote({ title: 'Para borrar', content: 'Chau' });

        const result = service.deleteNote(created.id);

        expect(result).toBe(true);
        expect(service.getNote(created.id)).toBeUndefined();
    });

    it('devuelve false si el id no existe', () => {
        const result = service.deleteNote(999);

        expect(result).toBe(false);
    });
});
