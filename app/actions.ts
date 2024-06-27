"use server";

import axios from "axios";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Course } from "./courses/courses";
import { ProfileData } from "./profile/profile";

const apiUrl = "http://api:5000/";
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

export async function logout() {
    cookies().delete("session");
    redirect("/");
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

export async function getProfile() {
    const session = cookies().get("session")?.value;
    if (!session) return;

    return await rapi(session).get("/auth/profile").then(async (res) => {
        const jwt = res.data.jwt;
        const data = decodeJwt(jwt);
        data.pfp = await rapi(session)
            .get(`${apiUrl}/files/${data.pfp}`, { responseType: "arraybuffer" })
            .then(res => btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ""))
            );
        data.pfp = `data:;base64,${data.pfp}`;

        return data as unknown as ProfileData;
    }).catch(_error => {
        cookies().delete("session");
        redirect("/login");
    });
}


function addSession(jwt: string) {
    const fourWeeks = 1000 * 60 * 60 * 24 * 28;
    cookies().set("session", jwt, { expires: Date.now() + fourWeeks, });
}
