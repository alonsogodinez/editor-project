import {SocketIOConnection} from "@slate-collaborative/backend";
import {Server} from "http";
import {getNote, updateNoteContent} from './services/notes';
import {SocketIOCollaborationOptions} from "@slate-collaborative/backend/lib/SocketIOConnection";

export function initSocketServer(server: Server): void {
    const config: SocketIOCollaborationOptions = {
        entry: server, // or specify port to start io server
        defaultValue: [],
        saveFrequency: 2000,
        onAuthRequest: async (query, socket) => {
            return true
        },
        onDocumentLoad: async (pathname) => {
            const note =  await getNote(pathname)
            return note.content
        },
        onDocumentSave: async (pathname, doc) => {
            await updateNoteContent(pathname, doc)
        }
    }

    const connection = new SocketIOConnection(config)


}