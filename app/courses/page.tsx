import { Container, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import CourseCard from "./CourseCard/CourseCard";
import React from "react";

export interface Course {
  title: string;
  author: string;
  description: string;
  tags: string[];
}

const courses: Course[] = [
  {
    title: "Test Course",
    author: "Krit Dass",
    description:
      "This is a test course that I made with the purpose of testing.",
    tags: ["stuff", "course", "test"],
  },
];

export default function Courses() {
  return (
    <Container my={40}>
      <TextInput
        leftSection={<IconSearch />}
        radius="xl"
        size="md"
        placeholder="Search courses..."
      ></TextInput>
      <Group mt="xl">
        {courses.map((course, i) => (
          <CourseCard key={i} {...course} />
        ))}
      </Group>
    </Container>
  );
}
