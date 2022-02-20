import { Descendant } from 'slate'
import express, { RequestHandler, Response } from 'express'
import {getNote, getNotes} from "../services/notes";

// Patch `express.Router` to support `.ws()` without needing to pass around a `ws`-ified app.
// https://github.com/HenningM/express-ws/issues/86
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const patch = require('express-ws/lib/add-ws-method')
// patch.default(express.Router)

const router = express.Router()

export interface NotesResponse {
  notes: Array<{
    id: string
    title: string
  }>
}

export interface NoteResponse {
  id: string
  title: string
  content: Array<Descendant>
}

const notesHandler: RequestHandler = async (_req, res: Response<NotesResponse>) => {
  const notes = await getNotes()
  res.json(notes)
}

const noteHandler:RequestHandler = async (req, res) => {
  try {
    const note = await getNote(req.params.id)

    res.json(note)

  } catch(err) {
    res.status(500).send("Error getting note")
  }

}

// const noteHandler: WebsocketRequestHandler = (client, req) => {
//   if(!noteSocketRooms.has(req.params.id)) {
//     noteSocketRooms.set(req.params.id, new Set())
//   }
//   if(!noteSocketRooms.get(req.params.id).has(client)) {
//     noteSocketRooms.get(req.params.id).add(client)
//   }
//
//   client.on('message', async (message: string) => {
//
//     if(message) {
//       await updateNote(JSON.parse(message)  as NoteResponse)
//
//       noteSocketRooms.get(req.params.id).forEach((client: any) => {
//         client.send(message )
//       })
//     } else if(req.params.id){
//       console.log('alo', JSON.stringify(NOTE_1))
//       console.log(req.params.id, typeof req.params.id)
//       const note = await getNote(req.params.id)
//       console.log({note})
//       client.send(JSON.stringify(note))
//     }
//   })
// }

router.get('/', notesHandler)
router.get('/:id', noteHandler)
// router.ws('/:id', noteHandler)

export default router