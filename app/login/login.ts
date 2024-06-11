"use server";

import axios from "axios";

export default async function login(_currentState: unknown, formData: FormData) {
    try {
        await axios.post("/api/user/login", { email: formData.get("email"), pw: formData.get("pw") });
        return "success";
    } catch (error) {
        console.error(error);
        return "something went wrong";
    }
}
