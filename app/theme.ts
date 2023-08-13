"use client";
import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "violet",
  fontFamily: "inter, sans-serif",
  fontFamilyMonospace: "jetbrains mono, monospace",
  defaultGradient: {
    from: "purple",
    to: "violet",
    deg: 135
  }
});
