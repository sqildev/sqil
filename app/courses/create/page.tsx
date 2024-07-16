"use client";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { ReactNode, useState } from "react";
import CourseItem from "./CourseItem";
import { Button, NativeSelect, Paper } from "@mantine/core";
import TextEditor from "../../TextEditor";
import CodeEditor from "../../CodeEditor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function CreateCourse() {
  const [items, setItems] = useState<number[]>([]);
  const [components, setComponents] = useState<ReactNode[]>([]);
  const [component, setComponent] = useState<string>("text");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active?.id as number);
        const newIndex = items.indexOf(over?.id as number);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const handleClick = () => {
    setItems((items) => [...items, items.length]);
    if (component === "text") {
      setComponents((components) => [...components, <TextEditor />]);
    } else {
      setComponents((components) => [
        ...components,
        <CodeEditor language="python" />,
      ]);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <PanelGroup direction="horizontal" style={{ width: "55vw" }}>
        <Panel defaultSize={30} minSize={20}>
          <Paper shadow="xs" p="md" h="100%">
            <NativeSelect
              value={component}
              onChange={(e) => setComponent(e.currentTarget.value)}
              label="Add component"
              data={["text", "code"]}
            />

            <Button onClick={handleClick} fullWidth>
              Add
            </Button>
          </Paper>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={70} minSize={40}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((id) => (
              <CourseItem key={id} id={id} components={components} />
            ))}
          </SortableContext>
        </Panel>
      </PanelGroup>
    </DndContext>
  );
}

export default CreateCourse;
