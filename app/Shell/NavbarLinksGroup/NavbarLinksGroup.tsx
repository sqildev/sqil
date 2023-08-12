import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./navlinksgroup.module.css";
import Link from "next/link";

interface LinksGroupProps {
  link: string;
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export default function LinksGroup({
  link,
  icon: Icon,
  label,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      unstyled
      component={Link}
      className={classes.link}
      href={link.link}
      key={link.label}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group gap={0}>
          {hasLinks ? (
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="filled" size={35}>
                <Icon size="1.5rem" />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          ) : (
            <Box
              style={{ display: "flex", alignItems: "center" }}
              className={classes.bigLink}
              component={Link}
              href={link}
            >
              <ThemeIcon variant="filled" size={35}>
                <Icon size="1.5rem" />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          )}
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? "rotate(90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
