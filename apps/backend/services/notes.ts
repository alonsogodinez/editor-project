import firestore from '../firebase';
import {NoteResponse, NotesResponse} from "../routes/notes";
import {Descendant, Node} from 'slate'
const Notes =  firestore.collection('notes');

type TNote = {
    content: Descendant[],
    title: string
}

export async function updateNoteContent (id:string,  content: Node[]): Promise<FirebaseFirestore.WriteResult> {
    const doc = await Notes.doc(id).get()
    if(doc.exists) {
        return Notes.doc(id).update({
            // content: JSON.stringify(content)
            content
        })
    }
    return Promise.reject('Note not found')
}

export async function getNote (id: string): Promise<NoteResponse> {
    const doc = await Notes.doc(id).get()
    if(doc.exists) {
        const {content, title} = doc.data() as TNote
        return {
            id,
            title,
            // content: JSON.parse(content)
            content
        }
    }
    return Promise.reject()
}

export async function getNotes (): Promise<NotesResponse> {
    const docs = await Notes.get()
    const notes =  docs.docs.map(doc => {
        const { title} = doc.data() as TNote
        return {
            id: doc.id,
            title
        }
    })

    return {notes}
}