import React, {MouseEventHandler, ReactNode} from 'react'
import {useSlate} from 'slate-react'
import {isBlockActive, isMarkActive, toggleBlock, toggleLink, toggleMark} from './helpers'
import {CustomElementType} from './CustomElement'
import {CustomText} from './CustomLeaf'
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

interface ButtonProps {
  active: boolean
  onMouseDown: MouseEventHandler<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({ active, children, onMouseDown }) => (
  <button onMouseDown={onMouseDown} style={{ backgroundColor: active ? '#333' : 'white', color: active ? 'white' : '#333', border: '1px solid #eee' }}>{children}</button>
)


const Icon: React.FC = ({ children }) => (
      <span style={{width: '1em',height: '1em',     fontSize: '1.2rem'}}>{children} </span>
)

interface BlockButtonProps {
  format: CustomElementType
  icon: ReactNode
}

const BlockButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        format === CustomElementType.link ?  toggleLink(editor) :  toggleBlock(editor, format)
      }}
    >
      {icon}
    </Button>
  )
}

interface MarkButtonProps {
  format: keyof CustomText
  icon: ReactNode
}


const MarkButton: React.FC<MarkButtonProps> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
       toggleMark(editor, format)
      }}
    >
        {icon}
    </Button>
  )
}

export const EditorToolbar: React.FC = () => {
  return (
    <div style={{ display: 'flex'}}>
      <MarkButton format="bold" icon={<FormatBoldIcon/>} />
      <MarkButton format="italic" icon={<FormatItalicIcon/>} />
      <MarkButton format="underline" icon={<FormatUnderlinedIcon/>} />
      <MarkButton format="code" icon={<CodeIcon/>} />
      <BlockButton format={CustomElementType.link} icon={<InsertLinkIcon/>} />
      <BlockButton format={CustomElementType.headingOne} icon={<Icon>H1</Icon>} />
      <BlockButton format={CustomElementType.headingTwo} icon={<Icon>H2</Icon>} />
      <BlockButton format={CustomElementType.blockQuote} icon={<FormatQuoteIcon/>} />
      <BlockButton format={CustomElementType.numberedList} icon={<FormatListNumberedIcon/>} />
      <BlockButton format={CustomElementType.bulletedList} icon={<FormatListBulletedIcon/>} />
    </div>
  )
}