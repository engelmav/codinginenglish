// 'use client'

// import { MDXEditor, MDXEditorMethods, headingsPlugin } from "@mdxeditor/editor"


// /**
//  * Extend this Component further with the necessary plugins or props you need.
//  * proxying the ref is necessary. Next.js dynamically imported components don't support refs. 
// */
// const Editor = ({ markdown, editorRef }) => {
//     return <MDXEditor ref={editorRef} markdown={markdown} plugins={[headingsPlugin()]} />
// }

// export default Editor


"use client"
// InitializedMDXEditor.tsx
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor
} from "@mdxeditor/editor";
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo'
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles'
import { InsertTable } from '@mdxeditor/editor/plugins/toolbar/components/InsertTable'

import { toolbarPlugin, } from '@mdxeditor/editor/plugins/toolbar'

// import { MDXEditor, MDXEditorMethods, headingsPlugin } from "@mdxeditor/editor"


// Only import this to the next file
export default function InitializedMDXEditor({
    editorRef,
    ...props
}) {
    return (
        <MDXEditor
            plugins={[
                // Example Plugin Usage
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                toolbarPlugin({
                    toolbarContents: () => (<> <UndoRedo /><BoldItalicUnderlineToggles /><InsertTable /></>)
                })
            ]}
            {...props}
            ref={editorRef}
        />
    );
}
