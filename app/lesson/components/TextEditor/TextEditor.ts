import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Component from "./Component";

export default Node.create({
    name: "TextEditor",
    group: "block",
    parseHTML() {
        return [{ tag: "text-editor" }];
    },
    renderHTML({ HTMLAttributes }) {
        return ["text-editor", mergeAttributes(HTMLAttributes)];
    },
    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
