import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  MantineStyleProp,
  darken,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandGithub,
  IconMail,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import LightDark from "./LightDark";

interface Props {
  pad?: number;
  href?: string;
  cursor?: string;
  onClick?: () => void;
  children?: JSX.Element;
  rest?: MantineStyleProp;
}

export default function Shell({ children }: Props) {
  const { setColorScheme } = useMantineColorScheme();
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  function HeaderButton({ children, href, onClick, pad, ...rest }: Props) {
    const size = 50;
    const Comp = ({ children, cursor, ...rest }: Props) => {
      return (
        <>
          {href ? (
            <Box p="md" component="a" href={href} {...rest}>
              {children}
            </Box>
          ) : (
            <Box p="md" onClick={onClick} {...rest}>{children}</Box>
          )}
        </>
      );
    };

    return (
      <Comp {...rest}>
        <ActionIcon h={size} w={size} c={theme.colors.octo[1]} p={pad}>
          {children}
        </ActionIcon>
      </Comp>
    );
  }
  const iconSize = 30;

  return (
    <AppShell header={{ height: 100 }} p="md">
      <AppShell.Header p="sm" bg={darken(theme.colors.octo[9], 0.5)}>
        <Group justify="space-evenly">
          <Group gap={0}>
            <Burger
              opened={opened}
              onClick={toggle}
              size="md"
              mr="md"
              hiddenFrom="md"
            />
            <Avatar
              component={Link}
              href="/"
              src="/logo.ico"
              alt="OctiLearn Logo"
              size="lg"
              radius="0%"
              mr="xs"
            />
          </Group>
          <Group gap={0}>
            <HeaderButton href="https://github.com/OctiLearnProject">
              <IconBrandGithub size={iconSize} />
            </HeaderButton>
            <HeaderButton href="mailto:octilearnteam@gmail.com">
              <IconMail size={iconSize} />
            </HeaderButton>
            <LightDark
              component={HeaderButton}
              lightProps={{ onClick: () => setColorScheme("dark"), pad: 8 }}
              darkProps={{ onClick: () => setColorScheme("light"), pad: 7 }}
              light={<IconMoon size={iconSize} />}
              dark={<IconSun size={iconSize} />}
            />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
