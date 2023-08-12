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
  Text
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconX } from "@tabler/icons-react";
import React from "react";
import classes from "./login.module.css";
import Link from "next/link";

const requirements = [
  { re: /^.{6,}$/, label: "Less than 6 characters" },
  { re: /[0-9]/, label: "No numbers" },
  { re: /[a-z]/, label: "No lowercase letters" },
  { re: /[A-Z]/, label: "No uppercase letters" },
  { re: /[$&+,:;=?@#|"<>.^*()%!-]/, label: "No special symbols" },
];

interface Data {
  email: string;
  password: string;
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
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (requirements.every(({ re }) => re.test(value)) ? null : "Invalid password")
    }
  });
  const strength = getStrength(data.values.password);
  const emailSuggestions =
    data.values.email.length > 0 && !data.values.email.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com"].map(
        (provider) => `${data.values.email}@${provider}`,
      )
      : [];

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        value={
          data.values.password.length > 0 && index === 0
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
        display={re.test(data.values.password) ? "none" : "flex"}
        key={index}
      >
        <IconX size="1.2rem" />
        <Box ml={7}>{label}</Box>
      </Group>
    );
  });

  return (
    <form>
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
            {...data.getInputProps("password")}
          />
          <Group gap={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          {checks}
        </div>
        <Button type="submit" w="100%">Log In</Button>
        <Text>New to Sqil? <Link href="/signup" style={{ textDecoration: "none" }}>Sign Up</Link></Text>
      </Stack>
    </form>
  );
}
