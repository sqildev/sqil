import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import useData from "./useData";
import useActions from "./useActions";
import { useEffect, useState } from "react";
import { UnstyledButton, Menu, rem, Group } from "@mantine/core";
import {
  IconAlignBoxLeftMiddle,
  IconBlockquote,
  IconClearFormatting,
  IconClipboard,
  IconClipboardCopy,
  IconCode,
  IconCodeDots,
  IconGripVertical,
  IconH1,
  IconH2,
  IconH3,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

export function DragMenu({
  editor,
  openCodeEditorModal,
}: {
  editor: Editor;
  openCodeEditorModal: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useActions(editor, data.currentNode, data.currentNodePos);

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta("lockDragHandle", true);
    } else {
      editor.commands.setMeta("lockDragHandle", false);
    }
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="DragMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{ offset: [-2, 16], zIndex: 99 }}
    >
      <Group justify="center" grow>
        <Menu trigger="hover">
          <Menu.Target>
            <UnstyledButton>
              <IconPlus />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Heading</Menu.Label>
            <Menu.Item
              leftSection={
                <IconH1 style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "heading",
                    attrs: { level: 1 },
                  }).run
              }
            >
              Heading 1
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconH2 style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "heading",
                    attrs: { level: 2 },
                  }).run
              }
            >
              Heading 2
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconH3 style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "heading",
                    attrs: { level: 3 },
                  }).run
              }
            >
              Heading 3
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Editor</Menu.Label>
            <Menu.Item
              leftSection={
                <IconCode style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => {
                editor.setEditable(false);
                openCodeEditorModal();
              }}
            >
              Code Editor
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconAlignBoxLeftMiddle
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
              onClick={
                editor
                  .chain()
                  .focus()
                  .insertContent("<text-editor></text-editor>").run
              }
            >
              Text Editor
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Content</Menu.Label>

            <Menu.Item
              leftSection={
                <IconBlockquote style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={
                editor.chain().focus().insertContent({ type: "paragraph" }).run
              }
            >
              Text
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconCodeDots style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={
                editor.chain().focus().insertContent("<pre><code></code></pre>")
                  .run
              }
            >
              Code Block
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Menu opened={menuOpen} onChange={setMenuOpen}>
          <Menu.Target>
            <UnstyledButton>
              <IconGripVertical />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconClearFormatting
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
              onClick={actions.resetTextFormatting}
            >
              Clear formatting
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconClipboard style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={actions.copyNodeToClipboard}
            >
              Copy to clipboard
            </Menu.Item>

            <Menu.Item
              leftSection={
                <IconClipboardCopy
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
              onClick={actions.duplicateNode}
            >
              Duplicate
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={actions.deleteNode}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </DragHandle>
  );
}
