import "@mantine/core/styles.css";
import React from "react";
import { ColorSchemeScript } from "@mantine/core";
import "./globals.css";
import Shell from "./Shell";
import Providers from "./providers";
import { getProfile } from "./actions";

export const metadata = {
  title: "Sqil",
  description: "A teacher-centric platform for course design.",
};

export default async function RootLayout({ children }: { children: any }) {
  const profile = await getProfile();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <Shell profile={profile}>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
