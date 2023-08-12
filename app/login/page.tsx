"use client";
import {
  Autocomplete,
  Box,
  Button,
  Group,
  PasswordInput,
  Progress,
  Stack,
  rem,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import Link from "next/link";
import axios, { AxiosResponse } from "axios";

interface Data {
  email: string;
  pw: string;
}

export default function Login() {
  const data = useForm<Data>({
    initialValues: { email: "", pw: "" },
  });
  const emailSuggestions =
    data.values.email.length > 0 && !data.values.email.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com"].map(
          (provider) => `${data.values.email}@${provider}`,
        )
      : [];
  const [loginStatus, setLoginStatus] = useState<string>();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        axios
          .post("/api/user/login", data.values)
          .then((response) => setLoginStatus(response.data));
      }}
    >
      <Stack gap="lg">
        <Autocomplete
          required
          label="Email Address"
          placeholder="Email"
          leftSection={<IconAt />}
          leftSectionPointerEvents="none"
          data={emailSuggestions}
          {...data.getInputProps("email")}
        />
        <PasswordInput
          required
          placeholder="Password"
          label="Password"
          {...data.getInputProps("pw")}
        />
        <div>
          <Button type="submit" w="100%">
            Log In
          </Button>
          <Text size="sm" c="red" mt="xs">
            {loginStatus}
          </Text>
        </div>
        <Text size="sm">
          New to Sqil?{"  "}
          <Link href="/register" style={{ textDecoration: "none" }}>
            Register
          </Link>
        </Text>
      </Stack>
    </form>
  );
}
