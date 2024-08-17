"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import CodeEditor from "./components/CodeEditor";
import TextEditor from "./components/TextEditor";
import Dropcursor from "@tiptap/extension-dropcursor";
import { DragMenu } from "./components/DragMenu/DragMenu";
import classes from "./lesson.module.css";
import { useDisclosure } from "@mantine/hooks";
import CodeEditorModal from "./components/CodeEditorModal";

function CreateLesson() {
  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, CodeEditor, TextEditor, Dropcursor],
    editorProps: {
      attributes: {
        class: classes.editor,
      },
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  if (!editor) return null;

  return (
    <div className={classes.editorContainer}>
      <CodeEditorModal
        editor={editor}
        opened={opened}
        close={() => {
          close();
          editor.setEditable(true);
        }}
      />
      <DragMenu editor={editor} openCodeEditorModal={open} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default CreateLesson;
