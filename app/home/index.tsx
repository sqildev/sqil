import React from "react";
import { Title } from "@mantine/core";
import classes from "./home.module.css";

export default function HomePage() {
  return (
    <>
      <Title p="xl" className={classes.bigText}>
        A new framework for course design.
      </Title>
    </>
  );
}
