import { Button, Modal, Select, Text } from "@mantine/core";
import React, { useState } from "react";
import { BareCodeEditor } from "../CodeEditor/Component";
import { Editor } from "@tiptap/react";

export function CodeEditorModal({
  opened,
  close,
  editor,
}: {
  opened: boolean;
  close: () => void;
  editor: Editor;
}) {
  const [language, setLanguage] = useState<string | null>("");
  const [code, setCode] = useState("");

  return (
    <Modal opened={opened} onClose={close} centered>
      <Text size="lg" fw={500}>
        Create Code Editor
      </Text>
      <Select
        label="Language"
        value={language}
        onChange={setLanguage}
        placeholder="Pick language"
        data={[
          { label: "Python", value: "python" },
          { label: "JavaScript", value: "javascript" },
          { label: "CPP", value: "cpp" },
        ]}
        clearable
      />
      {language && (
        <BareCodeEditor language={language} code={code} setCode={setCode} />
      )}
      {language && (
        <Button
          variant="gradient"
          fullWidth
          onClick={() => {
            editor
              .chain()
              .focus()
              .insertContent(
                `<code-editor language="${language}" code="${code.replaceAll('"', "&quot;")}"></code-editor>`,
              )
              .run();

            close();
          }}
        >
          Create
        </Button>
      )}
    </Modal>
  );
}
