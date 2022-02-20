import {CustomTypes, Editor, Text, Transforms} from "slate";
import {jsx} from "slate-hyperscript";
import {CustomElement} from "./CustomElement";
import isUrl from "is-url";
import {wrapLink} from "./helpers";

const ELEMENT_TEXT_TYPES = [
    'quote',
    'paragraph',
    'heading-one',
    'heading-two',
    'heading-three',
    'heading-four',
    'heading-five',
    'heading-six'
]

const ELEMENT_TAGS_MAPPER = {
    A: (el: Element) => ({ type: 'link', url: el.getAttribute('href') }),
    BLOCKQUOTE: () => ({ type: 'quote' }),
    H1: () => ({ type: 'heading-one' }),
    H2: () => ({ type: 'heading-two' }),
    H3: () => ({ type: 'heading-three' }),
    H4: () => ({ type: 'heading-four' }),
    H5: () => ({ type: 'heading-five' }),
    H6: () => ({ type: 'heading-six' }),
    IMG: (el: Element) => ({ type: 'image', url: el.getAttribute('src') }),
    LI: () => ({ type: 'list-item' }),
    OL: () => ({ type: 'numbered-list' }),
    P: () => ({ type: 'paragraph' }),
    PRE: () => ({ type: 'code' }),
    UL: () => ({ type: 'bulleted-list' }),
}

const TEXT_TAGS_MAPPER = {
    CODE: () => ({ code: true }),
    DEL: () => ({ strikethrough: true }),
    EM: () => ({ italic: true }),
    I: () => ({ italic: true }),
    S: () => ({ strikethrough: true }),
    STRONG: () => ({ bold: true }),
    B: () => ({ bold: true }),
    U: () => ({ underline: true }),
}


// hack: https://codesandbox.io/s/slate-minimal-paste-html-example-with-fixes-p3nxd?file=/index.js:4111-4267
const wrapTopLevelInlineNodesInParagraphs = (editor: CustomTypes['Editor'], fragment: Node[]) => {
    let inlineNodes: Node[] = []
    const newFragments: Array<Node | CustomElement> = []

    const maybePushInlineNodeParagraph = () => {
        if (inlineNodes.length > 0) {
            newFragments.push(jsx('element', {type: 'paragraph'}, inlineNodes))
            inlineNodes = []
        }
    }

    fragment.forEach(node => {
        if (Text.isText(node) || Editor.isInline(editor, node)) {
            inlineNodes.push(node)
        } else {
            maybePushInlineNodeParagraph()
            newFragments.push(node)
        }
    })

    maybePushInlineNodeParagraph()

    return newFragments
}

const deserializeHTML = (el: Node): any => {
    if (el.nodeType === 3) {
        return el.textContent
    } else if (el.nodeType !== 1) {
        return null
    } else if (el.nodeName === 'BR') {
        return '\n'
    }

    const {nodeName} = el
    let parent = el

    if (
        nodeName === 'PRE' &&
        el.childNodes[0] &&
        el.childNodes[0].nodeName === 'CODE'
    ) {
        parent = el.childNodes[0]
    }
    let children = Array.from(parent.childNodes)
        .map(deserializeHTML)
        .flat()

    if (children.length === 0) {
        children = [{text: ''}]
    }

    if (nodeName === 'BODY') {
        return jsx('fragment', {}, children)
    }

    if (ELEMENT_TAGS_MAPPER[nodeName as keyof typeof ELEMENT_TAGS_MAPPER]) {
        const attrs = ELEMENT_TAGS_MAPPER[nodeName as keyof typeof ELEMENT_TAGS_MAPPER](el as Element)

        return jsx('element', attrs, children)
    }


    if (TEXT_TAGS_MAPPER[nodeName as keyof typeof TEXT_TAGS_MAPPER]) {
        const attrs = TEXT_TAGS_MAPPER[nodeName as keyof typeof TEXT_TAGS_MAPPER]()
        // TODO: find a better way to handle nested non-text tags
        return children.map(child => jsx(ELEMENT_TEXT_TYPES.includes(child.type) ? 'text' : 'element', attrs, child))
    }

    return children
}

export const withHtml = (editor: CustomTypes['Editor']): CustomTypes['Editor'] => {
    const {insertData, isInline, insertText} = editor

    editor.isInline = (element: CustomElement) => {
        return element.type === 'link' ? true : isInline(element)
    }

    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertText(text)
        }
    }

    editor.insertData = data => {
        const html = data.getData('text/html')

        if (html) {
            const parsed = new DOMParser().parseFromString(html, 'text/html')
            const fragment = deserializeHTML(parsed.body)
            let fragmentWithOnlyBlocks = fragment
            if (Array.isArray(fragment)) {
                fragmentWithOnlyBlocks = wrapTopLevelInlineNodesInParagraphs(
                    editor,
                    fragment
                )
            }
            Transforms.insertFragment(editor, fragmentWithOnlyBlocks)
            return
        } else {
            const text = data.getData('text/plain')
            if (text && isUrl(text)) {
                wrapLink(editor, text)
            } else {
                insertData(data)
            }
        }
    }

    return editor
}