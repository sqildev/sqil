import React from "react";
import { Group, Stack, Text } from "@mantine/core";
import classes from "./home.module.css";

export default function HomePage() {
  return (
    <Stack gap={0}>
      <Group justify="center">
        <Text className={classes.bigText}>
          A New
        </Text>
        <Text
          className={classes.bigText}
          variant="gradient"
        >
          Framework
        </Text>
        <Text p={0} className={classes.bigText}>
          for
        </Text>
      </Group>
      <Group justify="center">
        <Text
          className={classes.bigText}
          variant="gradient"
        >
          Course
        </Text>
        <Text className={classes.bigText}>
          Design.
        </Text>
      </Group>
    </Stack>
  );
}
