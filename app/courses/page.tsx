"use client";
import { Container, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import CourseCard from "./CourseCard/CourseCard";
import React, { useState } from "react";
import axios from "axios";

export interface Course {
    title: string;
    author: string;
    description: string;
    tags: string[];
}

function filterCourse(course: Course, search: string): boolean {
    search = search.toLowerCase();
    return (
        course.tags.some((tag) => tag.toLowerCase().includes(search)) ||
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.author.toLowerCase().includes(search)
    );
}

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>();
    const [search, setSearch] = useState<string>("");
    // axios.get("/api/course/list").then((res) => setCourses(res.data));

    return (
        <Container my={40}>
            <TextInput
                leftSection={<IconSearch />}
                radius="md"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
            ></TextInput>
            <Group mt="xl" justify="center">
                {/*courses
          ?.filter((course) => filterCourse(course, search))
          .map((course, i) => (
            <CourseCard key={i} {...course} />
          ))*/}
            </Group>
        </Container>
    );
}
