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

const requirements = [
  { re: /^.{6,}$/, label: "Less than 6 characters" },
  { re: /[0-9]/, label: "No numbers" },
  { re: /[a-z]/, label: "No lowercase letters" },
  { re: /[A-Z]/, label: "No uppercase letters" },
  { re: /[$&+,:;=?@#|"<>.^*()%!-]/, label: "No special symbols" },
];

interface Data {
  email: string;
  pw: string;
}

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export default function Login() {
  const data = useForm<Data>({
    initialValues: { email: "", pw: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      pw: (value) =>
        requirements.every(({ re }) => re.test(value))
          ? null
          : "Invalid password",
    },
  });
  const strength = getStrength(data.values.pw);
  const emailSuggestions =
    data.values.email.length > 0 && !data.values.email.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com"].map(
        (provider) => `${data.values.email}@${provider}`,
      )
      : [];
  const [loginStatus, setLoginStatus] = useState<string>();

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        value={
          data.values.pw.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
              ? 100
              : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  const checks = requirements.map(({ re, label }, index) => {
    return (
      <Group
        mt="xs"
        c="red"
        fz="sm"
        gap={rem(3)}
        display={re.test(data.values.pw) ? "none" : "flex"}
        key={index}
      >
        <IconX size="1.2rem" />
        <Box ml={7}>{label}</Box>
      </Group>
    );
  });

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
        <div>
          <PasswordInput
            required
            placeholder="Password"
            label="Password"
            {...data.getInputProps("pw")}
          />
          <Group gap={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          {checks}
        </div>
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
          <Link href="/signup" style={{ textDecoration: "none" }}>
            Sign Up
          </Link>
        </Text>
      </Stack>
    </form>
  );
}
