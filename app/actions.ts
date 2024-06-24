"use server";

import axios from "axios";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Course } from "./courses/courses";

const apiUrl = "http://localhost:5000/api/";
const api = axios.create({ baseURL: apiUrl, });
const rapi = (session: string) => axios.create({ baseURL: apiUrl, headers: { "Authorization": `Bearer ${session}` } });

export async function register(_currentState: unknown, formData: FormData) {
    let ok = false;
    const msg = await api.post("/auth/register", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(res => {
        const jwt = res.data.jwt;
        const data = decodeJwt(jwt);

        const session = data.jwt as string;
        addSession(session);
        ok = true;

        return data.msg as string;
    }).catch(error => {
        if (error.response) {
            const jwt = error.response.data.jwt;
            const data = decodeJwt(jwt);

            return data.msg as string
        } else {
            console.error(error);
            return "Something went wrong.";
        }
    });

    if (ok) redirect("/");
    return msg;
}

export async function login(_currentState: unknown, formData: FormData) {
    let ok = false
    const msg = await api.post("/auth/login", { email: formData.get("email"), pw: formData.get("pw") }).then(res => {
        const jwt = res.data.jwt;
        const data = decodeJwt(jwt);

        const session = data.jwt as string;
        addSession(session);
        ok = true;

        return data.msg as string;
    }).catch(error => {
        if (error.response) {
            const jwt = error.response.data.jwt;
            const data = decodeJwt(jwt);

            return data.msg as string
        } else {
            return "Something went wrong.";
        }
    });

    if (ok) redirect("/");
    return msg;
}


export async function getCourses() {
    return await api
        .get("/course")
        .then((res) => decodeJwt(res.data.jwt).courses)
        .catch((e) => console.error(e)) as Course[];
}

export async function runCode(id: number, code: string) {
    const session = cookies().get("session")?.value;
    if (!session) redirect("/login");

    return await rapi(session).post("/compiler", { id, code }).then(res => {
        const jwt = res.data.jwt;
        const data = decodeJwt(jwt);

        return (data?.stdout ?? data?.compile_output ?? data?.stderr) as string;
    }).catch(error => {
        console.error(error);
        return "Something went wrong.";
    });
}


function addSession(jwt: string) {
    const fourWeeks = 1000 * 60 * 60 * 24 * 28;
    cookies().set("session", jwt, { expires: Date.now() + fourWeeks, });
}
