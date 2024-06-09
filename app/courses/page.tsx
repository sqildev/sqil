import React from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import Courses, { getCourses } from "./courses";


export default async function CoursesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["courses"],
        queryFn: getCourses,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Courses />
        </HydrationBoundary>
    );
}
