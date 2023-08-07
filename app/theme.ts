"use client";
import { createTheme, MantineColorsTuple } from "@mantine/core";

const octo: MantineColorsTuple = [
  "#f7ecff",
  "#e7d6fc",
  "#cbaaf2",
  "#ac7de8",
  "#9355e0",
  "#833cdb",
  "#7b2eda",
  "#6922c2",
  "#5d1cae",
  "#501699",
];

export const theme = createTheme({
  primaryColor: "octo",
  colors: {
    octo,
  },
  fontFamily: "inter, sans-serif",
  fontFamilyMonospace: "jetbrains mono, monospace",
});
