import { Node } from "@tiptap/pm/model";
import { NodeSelection } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";

const useActions = (
  editor: Editor,
  currentNode: Node | null,
  currentNodePos: number,
) => {
  const resetTextFormatting = () => {
    const chain = editor.chain();

    chain.setNodeSelection(currentNodePos).unsetAllMarks();

    if (currentNode?.type.name !== "paragraph") {
      chain.setParagraph();
    }

    chain.run();
  };

  const duplicateNode = () => {
    editor.commands.setNodeSelection(currentNodePos);

    const { $anchor } = editor.state.selection;
    const selectedNode =
      $anchor.node(1) || (editor.state.selection as NodeSelection).node;

    editor
      .chain()
      .setMeta("hideDragHandle", true)
      .insertContentAt(
        currentNodePos + (currentNode?.nodeSize || 0),
        selectedNode.toJSON(),
      )
      .run();
  };

  const copyNodeToClipboard = () => {
    editor
      .chain()
      .setMeta("hideDragHandle", true)
      .setNodeSelection(currentNodePos)
      .run();

    document.execCommand("copy");
  };

  const deleteNode = () => {
    editor
      .chain()
      .setMeta("hideDragHandle", true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();
  };

  return {
    resetTextFormatting,
    duplicateNode,
    copyNodeToClipboard,
    deleteNode,
  };
};

export default useActions;
