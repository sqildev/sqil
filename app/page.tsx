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
      header={{ height: 50 }}
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
          <Group gap="xs">
            <ActionIcon
              h={30}
              w={30}
            >
              <a style={{ color: "inherit" }} href="https://github.com/OctiLearnProject/">
                <IconBrandGithub />
              </a>
            </ActionIcon>
            <ActionIcon
              h={30}
              w={30}
            >
              <a style={{ color: "inherit" }} href="mailto:octilearnproject@gmail.com">
                <IconMail />
              </a>
            </ActionIcon>
            <LightDark
              component={ActionIcon}
              lightProps={{ onClick: () => setColorScheme("dark"), p: 2 }}
              darkProps={{ onClick: () => setColorScheme("light"), p: 1.5 }}
              light={<IconMoon />}
              dark={<IconSun />}
              h={30}
              w={30}
            />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
