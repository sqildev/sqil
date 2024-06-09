"use client";

import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000
            }
        }
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

export default function Providers({ children }: { children: any }) {
    const queryClient = getQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
                {children}
            </MantineProvider>
        </QueryClientProvider>
    );
}
