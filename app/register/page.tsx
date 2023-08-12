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
  TextInput,
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
  name: string;
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
    initialValues: { name: "", email: "", pw: "" },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          value,
        )
          ? null
          : "Invalid email",
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
  const [registerStatus, setRegisterStatus] = useState<string>();

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
          .post("/api/user/register", data.values)
          .then((response) => setRegisterStatus(response.data));
      }}
    >
      <Stack gap="lg">
        <TextInput
          required
          label="Name"
          placeholder="Name"
          {...data.getInputProps("name")}
        ></TextInput>
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
          <Group gap={5} grow mt="sm" mb="md">
            {bars}
          </Group>
          {checks}
        </div>
        <div>
          <Button type="submit" w="100%">
            Register
          </Button>
          <Text size="sm" c="red" mt="xs">
            {registerStatus}
          </Text>
        </div>
        <Text size="sm">
          Already have an account?{"  "}
          <Link href="/login" style={{ textDecoration: "none" }}>
            Sign In
          </Link>
        </Text>
      </Stack>
    </form>
  );
}
