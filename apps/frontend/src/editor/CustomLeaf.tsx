import React from 'react'
import {BaseText} from 'slate'
import {RenderLeafProps} from 'slate-react'
import Caret from "./Caret";

export interface CustomText extends BaseText {
    bold?: boolean
    code?: boolean
    italic?: boolean
    underline?: boolean
}

export const CustomLeaf: React.FC<RenderLeafProps> = ({attributes, children, leaf}) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return (
        <span {...attributes}
              style={
                  {
                      position: 'relative',
                      backgroundColor: leaf.alphaColor
                  } as any
              }
        >
            {leaf.isCaret ? <Caret {...(leaf as any)} /> : null}
            {children}
        </span>
    )

}


