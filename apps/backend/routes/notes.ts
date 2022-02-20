import express, { RequestHandler, Response } from 'express'
import { WebsocketRequestHandler } from 'express-ws'
import { Descendant } from 'slate'
import { NOTE_1, NOTE_2 } from '../fixtures/notes'

// Patch `express.Router` to support `.ws()` without needing to pass around a `ws`-ified app.
// https://github.com/HenningM/express-ws/issues/86
// eslint-disable-next-line @typescript-eslint/no-var-requires
const patch = require('express-ws/lib/add-ws-method')
patch.default(express.Router)

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

const notesHandler: RequestHandler = (_req, res: Response<NotesResponse>) => {
  res.json({
    notes: [
      {
        id: NOTE_1.id,
        title: NOTE_1.title
      }, {
        id: NOTE_2.id,
        title: NOTE_2.title
      }
    ]
  })
}

const noteSocketRooms = new Map()

const noteHandler: WebsocketRequestHandler = (client, req) => {
  if(!noteSocketRooms.has(req.params.id)) {
    noteSocketRooms.set(req.params.id, new Set())
  }
  if(!noteSocketRooms.get(req.params.id).has(client)) {
    noteSocketRooms.get(req.params.id).add(client)
  }

  client.on('message', (message) => {
    noteSocketRooms.get(req.params.id).forEach((client: any) => {
      client.send(message || JSON.stringify(NOTE_1))
    })
  })
}

router.get('/', notesHandler)
router.ws('/:id', noteHandler)

export default router