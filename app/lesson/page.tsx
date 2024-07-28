"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import CodeEditor from "./components/CodeEditor";
import TextEditor from "./components/TextEditor";
import Dropcursor from "@tiptap/extension-dropcursor";

function CreateLesson() {
  const editor = useEditor({
    extensions: [StarterKit, CodeEditor, TextEditor, Dropcursor],
    content: `
<p>Testing</p> 
<code-editor></code-editor>
<text-editor></text-editor>
<p>Test over</p>`,
  });

  return <EditorContent style={{ width: "80vw" }} editor={editor} />;
}

export default CreateLesson;
