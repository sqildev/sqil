import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "./theme";
import Shell from "./Shell";
import "./globals.css";

export const metadata = {
  title: "Sqil",
  description: "A teacher-centric platform for course design.",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Shell>{children}</Shell>
        </MantineProvider>
      </body>
    </html>
  );
}
