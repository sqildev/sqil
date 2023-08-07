"use client";
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

export default function HomePage() {
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
      <AppShell.Header p="xs">
        <Overlay
          gradient={`linear-gradient(105deg, ${theme.colors.octo[5]} 20%, ${theme.colors.octo[7]} 50%, ${theme.colors.octo[9]} 100%)`}
          opacity={0.2}
          zIndex={0}
        />
        <Group justify="space-between">
          <Group gap={0}>
            <Burger opened={opened} onClick={toggle} size="sm" mr="sm" />
            <Avatar
              src="/logo.ico"
              alt="OctiLearn Logo"
              size="sm"
              radius="0%"
              mr={7}
            />
            <Title order={3}>OctiLearn</Title>
          </Group>
          <Group gap="sm">
            <ActionIcon
              component="a"
              href="https://github.com/OctiLearnProject"
              h={40}
              w={40}
            >
              <IconBrandGithub />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="mailto:octilearnteam@gmail.com"
              h={40}
              w={40}
            >
              <IconMail />
            </ActionIcon>
            <LightDark
              component={ActionIcon}
              lightProps={{ onClick: () => setColorScheme("dark"), p: 3 }}
              darkProps={{ onClick: () => setColorScheme("light"), p: 2 }}
              light={<IconMoon />}
              dark={<IconSun />}
              h={40}
              w={40}
            />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
