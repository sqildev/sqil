import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Container,
  Group,
  Menu,
  Title,
  UnstyledButton,
  useMantineColorScheme,
  rem,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArticle,
  IconBooks,
  IconChevronDown,
  IconInfoSquareRoundedFilled,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { ReactNode } from "react";
import Logo from "../Logo";
import LightDark from "./LightDark/LightDark";
import LinksGroup from "./NavbarLinksGroup/";
import classes from "./shell.module.css";

const links = [
  {
    link: "about",
    label: "About",
    icon: IconInfoSquareRoundedFilled,
    initiallyOpened: true,
    links: [
      {
        link: "/about-us",
        label: "About Us",
      },
      {
        link: "/team",
        label: "Our Team",
      },
      {
        link: "/philosophy",
        label: "Philosophy",
      },
    ],
  },
  {
    link: "courses",
    label: "Courses",
    icon: IconBooks,
    initiallyOpened: true,
    links: [
      {
        link: "/courses",
        label: "Search Courses",
      },
      {
        link: "/create-course",
        label: "Create a Course",
      },
    ],
  },
  {
    link: "/blog",
    label: "Blog",
    icon: IconArticle,
  },
];

export default function Shell({ children }: { children?: ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);
  const { setColorScheme } = useMantineColorScheme();

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link} component={Link} href={item.link}>
        {item.label}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <Center className={classes.link}>
              <span className={classes.linkLabel}>{link.label}</span>
              <IconChevronDown size="0.9rem" stroke={1.5} />
            </Center>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} className={classes.link}>
        {link.label}
      </Link>
    );
  });

  return (
    <AppShell
      header={{
        height: 100,
      }}
      navbar={{
        breakpoint: "sm",
        width: 300,
        collapsed: { mobile: !opened, desktop: true },
      }}
      withBorder={false}
    >
      <AppShell.Header className={classes.header}>
        <Container>
          <div className={classes.inner}>
            <UnstyledButton component={Link} href="/">
              <Logo />
            </UnstyledButton>
            <Group>
              <Group gap={5} visibleFrom="sm">
                {items}
                <Button
                  bg="none"
                  className={classes.button}
                  component={Link}
                  href="/login"
                >
                  Sign in
                </Button>
              </Group>
              <LightDark
                component={ActionIcon}
                lightProps={{ onClick: () => setColorScheme("dark") }}
                darkProps={{ onClick: () => setColorScheme("light") }}
                light={<IconMoon size={30} />}
                dark={<IconSun size={30} />}
                h={40}
                w={40}
                p={4}
              />
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            </Group>
          </div>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbar}>
        <Group m="xl" justify="center">
          <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>
              {links.map((link) => (
                <LinksGroup {...link} key={link.label} />
              ))}
            </div>
          </ScrollArea>
        </Group>
      </AppShell.Navbar>

      <AppShell.Main mt="xl">{children}</AppShell.Main>
    </AppShell>
  );
}
