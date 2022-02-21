import React, {useMemo} from 'react'
import {Editor} from '../editor'
import {useNote} from './hooks'
import {v4} from 'uuid'

import {Paper, TextField, Badge} from '@mui/material'
import {withHtml} from "../editor/decorators";
import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {createEditor, Descendant} from "slate";
import {withIOCollaboration} from "@slate-collaborative/client";

interface SingleNoteProps {
    id: string
}

const userId = v4()

const Home: React.FC<SingleNoteProps> = ({id}) => {
    const {note} = useNote(id)
    const [isOnline, setIsOnline] = React.useState(false)
    const editor = useMemo(() => {
        const slateEditor = withHtml(withReact(withHistory(createEditor())))
        const origin = 'http://localhost:3001'
        const options = {
            docId: '/' + id,
            cursorData: {
                name: "Not You 😛",
                color: '#6200ee',
                alphaColor: 'rgba(255,0,0,0.5)',
            },
            url: `${origin}/${id}`,
            connectOpts: {
                query: {
                    token: userId,
                    slug: id
                }
            },
            onConnect: () => setIsOnline(true),
            onDisconnect: () => setIsOnline(false)
        }

        return withIOCollaboration<any>(slateEditor, options)
    }, [])


    return note ? (
        <>
            <Badge color={isOnline ? 'success' : 'error'} variant="dot" sx={{width: '100%'}}>
                <TextField
                    value={note?.title}
                    variant="standard"
                    fullWidth={true}
                    inputProps={{style: {fontSize: 32, color: '#666'}}}
                    sx={{mb: 2}}
                />
            </Badge>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Editor editor={editor} initialValue={note.content as Descendant[]} userId={userId} id={'n1'}/>
            </Paper>
        </>
    ) : null
}

export default Home