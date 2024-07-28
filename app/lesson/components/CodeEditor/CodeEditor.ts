import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Component from "./Component";

export default Node.create({
    name: "CodeEditor",
    group: "block",
    addAttributes() {
        return {
            language: {
                default: "python"
            },
            code: {
                default: ""
            },
            msg: {
                default: ""
            },
            tab: {
                default: "code"
            }
        }
    },
    parseHTML() {
        return [
            { tag: "code-editor" }
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return ["code-editor", mergeAttributes(HTMLAttributes)]
    },
    addNodeView() {
        return ReactNodeViewRenderer(Component)
    }
})
