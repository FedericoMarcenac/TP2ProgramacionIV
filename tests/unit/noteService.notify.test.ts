import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDb } from '../../src/db/connection';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { notify } from '../../src/services/notificationService';

vi.mock('../../src/services/notificationService', () => ({
    notify: vi.fn()
}));

describe('NoteService - notificacion al fijar (Ejercicio 6)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('llama a notify si la nota se crea con pinned en true', () => {
        const note = service.createNote({ title: 'Importante', content: 'No olvidar', pinned: true });

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(note);
    });

    it('no llama a notify si pinned es false', () => {
        service.createNote({ title: 'Normal', content: 'Nada', pinned: false });

        expect(notify).not.toHaveBeenCalled();
    });

    it('no llama a notify si no se manda pinned', () => {
        service.createNote({ title: 'Sin pinned', content: 'Nada' });

        expect(notify).not.toHaveBeenCalled();
    });
});
