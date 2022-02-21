// @refresh reset // Fixes hot refresh errors in development https://github.com/ianstormtaylor/slate/issues/3477

import React, {useCallback, useEffect, useState} from 'react'

import { BaseEditor, CustomTypes, Descendant} from 'slate'
import { HistoryEditor } from 'slate-history'
import { handleHotkeys } from './helpers'
import {useCursor} from "@slate-collaborative/client";

import { Editable, Slate, ReactEditor } from 'slate-react'
import { EditorToolbar } from './EditorToolbar'
import {CustomElement} from './CustomElement'
import { CustomLeaf, CustomText } from './CustomLeaf'

// Slate suggests overwriting the module to include the ReactEditor, Custom Elements & Text
// https://docs.slatejs.org/concepts/12-typescript
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement,
    Text: CustomText
  }
}

interface EditorProps {
  editor: CustomTypes['Editor']
  initialValue?: Descendant[]
  placeholder?: string
  id: string
  userId: string
}

export const Editor: React.FC<EditorProps> = ({ editor,initialValue=[], id, placeholder }) => {
  const [value, setValue] = useState<Descendant[]>(initialValue)



  useEffect(() => {
    editor.connect()
    return editor.destroy
  }, [])

  const { decorate } = useCursor(editor as any)
  
  const renderElement = useCallback(props => <CustomElement {...props} />, [])
  const renderLeaf = useCallback(props => <CustomLeaf {...props} />, [decorate])

  const handleChange = useCallback((value) => setValue(value), [setValue])



  return (
    <Slate editor={editor} value={value} onChange={handleChange} >
      <EditorToolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        onKeyDown={handleHotkeys(editor)}
        decorate={decorate as any}

        // The dev server injects extra values to the editr and the console complains
        // so we override them here to remove the message
        autoCapitalize="false"
        autoCorrect="false"
        spellCheck="false"
      />
    </Slate>
  )
}