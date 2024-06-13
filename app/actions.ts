"use server";

import axios from "axios";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(_currentState: unknown, formData: FormData) {
    const res = await axios.post("/api/auth/register", {
        name: formData.get("name"),
        email: formData.get("email"),
        pw: formData.get("pw")
    });

    const jwt = res.data.jwt;
    const data = decodeJwt(jwt);

    if (res.status == 200) {
        const session = data.jwt as string;
        addSession(session);
    }

    const msg = data.msg as string;
    return msg
}

export async function login(_currentState: unknown, formData: FormData) {
    const res = await axios.post("/api/auth/login", { email: formData.get("email"), pw: formData.get("pw") });
    const jwt = res.data.jwt;
    const data = decodeJwt(jwt);

    if (res.status == 200) {
        const session = data.jwt as string;
        addSession(session);
    }

    const msg = data.msg as string;
    return msg
}

function addSession(jwt: string) {
    const fourWeeks = 1000 * 60 * 60 * 24 * 28;
    cookies().set("session", jwt, { expires: Date.now() + fourWeeks, });
    redirect("/");
}
