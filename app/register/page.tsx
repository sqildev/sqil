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
  Paper,
  Container,
  Title,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconX } from "@tabler/icons-react";
import React from "react";
import Link from "next/link";
import { register } from "../actions";
import { useFormStatus, useFormState } from "react-dom";

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
  const [errorMessage, dispatch] = useFormState(register, undefined);
  const { pending } = useFormStatus();
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
    <Container size={420} my={20}>
      <Title c="dimmed" fw={900} ta="center">
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have a Sqil account?{"  "}
        <Anchor component={Link} href="/login" size="sm">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={dispatch}>
          <Stack gap="lg">
            <TextInput
              required
              label="Name"
              placeholder="Name"
              name="name"
              {...data.getInputProps("name")}
            ></TextInput>
            <Autocomplete
              required
              label="Email Address"
              placeholder="Email"
              leftSection={<IconAt />}
              leftSectionPointerEvents="none"
              data={emailSuggestions}
              name="email"
              {...data.getInputProps("email")}
            />
            <div>
              <PasswordInput
                required
                placeholder="Password"
                label="Password"
                name="pw"
                {...data.getInputProps("pw")}
              />
              <Group gap={5} grow mt="sm" mb="md">
                {bars}
              </Group>
              {checks}
            </div>
            <div>
              <Button
                type="submit"
                disabled={pending}
                onClick={(e) => pending && e.preventDefault()}
                w="100%"
                variant="gradient"
                fullWidth
              >
                Register
              </Button>
              {errorMessage && (
                <Text size="sm" c="red" mt="xs">
                  {errorMessage}
                </Text>
              )}
            </div>
            <Text size="sm">
              Already have an account?{"  "}
              <Link href="/login" style={{ textDecoration: "none" }}>
                Sign In
              </Link>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
