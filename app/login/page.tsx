"use client";
import {
  Anchor,
  Autocomplete,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt } from "@tabler/icons-react";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

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
    <Container size={420} my={40}>
      <Title c="dimmed" fw={900} ta="center">
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have a Sqil account?{"  "}
        <Anchor component={Link} href="/register" size="sm">
          Register
        </Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
              <Button type="submit" variant="gradient" fullWidth>
                Log In
              </Button>
              <Text size="sm" c="red" mt="xs">
                {loginStatus}
              </Text>
            </div>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
