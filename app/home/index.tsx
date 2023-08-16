import React from "react";
import { Text, Container, Group, Button } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import classes from "./home.module.css";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          A new{" "}
          <Text component="span" variant="gradient" inherit>
            framework
          </Text>{" "}
          for{" "}
          <Text component="span" variant="gradient" inherit>
            course
          </Text>{" "}
          design.
        </h1>

        <Text className={classes.description} c="dimmed">
          Create truly instructive programming courses with elegance. Sqil
          allows you to customize every aspect of your course while retaining
          its ease of use.
        </Text>

        <Group className={classes.controls}>
          <Button
            component={Link}
            href="/courses"
            size="xl"
            className={classes.control}
            variant="gradient"
          >
            Get started
          </Button>

          <Button
            component="a"
            href="https://github.com/sqildev"
            size="xl"
            variant="default"
            className={classes.control}
            leftSection={<IconBrandGithub size={20} />}
          >
            GitHub
          </Button>
        </Group>
      </Container>
    </div>
  );
}
