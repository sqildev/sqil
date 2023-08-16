"use client";
import { Card, Text, Group, Button, Badge, Anchor } from "@mantine/core";
import classes from "./courseCard.module.css";
import React from "react";
import Link from "next/link";
import { Course } from "../page";

export default function CourseCard({
  title,
  author,
  description,
  tags,
}: Course) {
  return (
    <Card withBorder radius="md" p="md">
      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {title}
          </Text>
        </Group>
        <Anchor component={Link} href={`/user/${author}`} fz="xs">
          {author}
        </Anchor>
        <Text fz="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      <Card.Section withBorder={false} className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Tags
        </Text>
        <Group gap={7} mt={5}>
          {tags.map((tag, i) => (
            <Badge key={i} variant="light">
              {tag}
            </Badge>
          ))}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button
          radius="md"
          style={{ flex: 1 }}
          component={Link}
          href={`/user/${author}/${title}`}
          variant="gradient"
        >
          Open course
        </Button>
      </Group>
    </Card>
  );
}
