"use server";

import axios from "axios";

export default async function register(_currentState: unknown, formData: FormData) {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
            name: formData.get("name"),
            email: formData.get("email"),
            pw: formData.get("pw")
        });

        return "success";
    } catch (error) {
        console.error(error);
        return "something went wrong";
    }
}
