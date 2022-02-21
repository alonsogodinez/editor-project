import {mockFirebase} from 'firestore-jest-mock'
import {mockUpdate, mockGet, mockDoc} from 'firestore-jest-mock/mocks/firestore'
import {NOTE_1, NOTE_2, NOTES} from "../fixtures/notes";

mockFirebase({
    database: {
        notes: [NOTE_1, NOTE_2],
    },
});

import {getNote, getNotes, updateNoteContent} from "./notes";


describe('note services', () => {
    mockFirebase({
        database: {
            notes: [NOTE_1, NOTE_2],
        },
    }, {
        includeIdsInData: true,
        simulateQueryFilters: true,
    });

    test('getNote', async () => {
        const note = await getNote(NOTE_1.id)
        expect(mockDoc).toHaveBeenCalledWith(NOTE_1.id)
        expect(mockGet).toHaveBeenCalled()
        expect(note.content).toEqual(NOTE_1.content)
    })

    test('getNotes', async () => {
        const {notes} = await getNotes()
        expect(mockGet).toHaveBeenCalled()
        expect(notes).toEqual(NOTES)
    })

    test('updateNoteContent', async () => {
        const updatedContent = [
            ...NOTE_1.content,
            {
                type: 'list-item',
                children: [{text: 'I just added this item'}],
            },
            {
                type: 'list-item',
                children: [{text: 'I just added this item too'}],
            }
        ]

        await updateNoteContent(NOTE_1.id, updatedContent)
        expect(mockUpdate).toHaveBeenCalledWith(
            {
                content: updatedContent
            }
        )
    })
})
