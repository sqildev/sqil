"use server";

import axios from "axios";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Course } from "./courses/courses";

const apiUrl = "http://api:5000";

export async function register(_currentState: unknown, formData: FormData) {
    let ok = false;
    const msg = await axios.post(`${apiUrl}/api/auth/register`, {
        name: formData.get("name"),
        email: formData.get("email"),
        pw: formData.get("pw")
    }).then(res => {
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

export async function login(_currentState: unknown, formData: FormData) {
    let ok = false
    const msg = await axios.post(`${apiUrl}/api/auth/login`, { email: formData.get("email"), pw: formData.get("pw") }).then(res => {
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
    return (await axios
        .get(`${apiUrl}/api/course`)
        .then((res) => decodeJwt(res.data.jwt).courses)
        .catch((e) => console.error(e))) as Course[];
}


function addSession(jwt: string) {
    const fourWeeks = 1000 * 60 * 60 * 24 * 28;
    cookies().set("session", jwt, { expires: Date.now() + fourWeeks, });
}
