import React from "react";
import { Group, Title, Image } from "@mantine/core";
import classes from "./home.module.css";

export default function HomePage() {
  return (
    <Group justify="space-around">
      <Title p="xl" className={classes.bigText}>
        A new framework for course design.
      </Title>
    </Group>
  );
}
