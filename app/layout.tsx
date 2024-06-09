import "@mantine/core/styles.css";
import React from "react";
import { ColorSchemeScript } from "@mantine/core";
import "./globals.css";
import Shell from "./Shell";
import Providers from "./providers";

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
                <Providers>
                    <Shell>
                        {children}
                    </Shell>
                </Providers>
            </body>
        </html>
    );
}
