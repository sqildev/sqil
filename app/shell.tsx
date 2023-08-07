"use client";
import React, { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Avatar,
  useMantineColorScheme,
  useMantineTheme,
  Title,
  Overlay,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconBrandGithub,
  IconMail,
} from "@tabler/icons-react";
import LightDark from "./LightDark";
import Link from "next/link";

interface Props {
  children?: ReactNode;
}

export default function Shell({ children }: Props) {
  const { setColorScheme } = useMantineColorScheme();
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      p="md"
    >
      <AppShell.Header p="sm">
        <Overlay
          gradient={`linear-gradient(105deg, ${theme.colors.octo[5]} 20%, ${theme.colors.octo[7]} 50%, ${theme.colors.octo[9]} 100%)`}
          opacity={0.3}
          zIndex={0}
        />
        <Group justify="space-between">
          <Group gap={0}>
            <Burger opened={opened} onClick={toggle} size="sm" mr="sm" />
            <Link
              href="/"
              style={{ textDecoration: "none", display: "inherit" }}
            >
              <Avatar
                src="/logo.ico"
                alt="OctiLearn Logo"
                size="sm"
                radius="0%"
                mr={7}
              />
              <Title order={3}>OctiLearn</Title>
            </Link>
          </Group>
          <Group gap="md">
            <ActionIcon
              component="a"
              href="https://github.com/OctiLearnProject"
              h={40}
              w={40}
              c={theme.colors.octo[1]}
              visibleFrom="md"
            >
              <IconBrandGithub />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="mailto:octilearnteam@gmail.com"
              h={40}
              w={40}
              c={theme.colors.octo[1]}
              visibleFrom="md"
            >
              <IconMail />
            </ActionIcon>
            <LightDark
              component={ActionIcon}
              lightProps={{ onClick: () => setColorScheme("dark"), p: 8 }}
              darkProps={{ onClick: () => setColorScheme("light"), p: 7 }}
              light={<IconMoon />}
              dark={<IconSun />}
              h={40}
              w={40}
              c={theme.colors.octo[1]}
            />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
