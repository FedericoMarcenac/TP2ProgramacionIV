import { describe, it, expect, beforeEach } from 'vitest';
import { createDb } from  '../../src/db/connection';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';

describe('NoteService - getNoteId (Ejercicio 3)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('se espera retornar una nota si el id existe', () => {
        const created = service.createNote({ title: 'Nota de prueba', content: 'Contenido' });
        const found = service.getNote(created.id);
        
        expect(found).toBeDefined();
        expect(found?.id).toBe(created.id);
        expect(found?.title).toBe('Nota de prueba');
    });

    it('debe retornar undefined si el id no existe', () => {
        const found = service.getNote(999);
        expect(found).toBeUndefined();
    });
});