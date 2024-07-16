import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grid, Paper, rem } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import React, { ReactNode } from "react";

function CourseItem({
  id,
  components,
}: {
  id: number;
  components: ReactNode[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Paper shadow="xs" p="md" component={Grid} withBorder>
        <Grid.Col span={1}>
          <div
            {...attributes}
            {...listeners}
            style={{ height: "100%", width: "100%" }}
          >
            <IconGripVertical
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: rem(30),
                height: "100%",
              }}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={11}>{components[id]}</Grid.Col>
      </Paper>
    </div>
  );
}

export default CourseItem;
