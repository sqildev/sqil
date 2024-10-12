import {
  Grid,
  GridCol,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

function About() {
  return (
    <>
      <Grid p="xl">
        <GridCol span={5.5}>
          <Image src="/octilearn.png" alt="Octilearn team" radius="xl" />
        </GridCol>
        <GridCol span={6.5} px="lg" style={{ textAlign: "justify" }}>
          <Title style={{ textAlign: "center" }} mb="sm">
            About Us
          </Title>
          <Text>
            We started out as{" "}
            <Link href="https://youtu.be/CBrgzgbfyMk?si=f1ypP8Htta0DC9SV">
              OctiLearn
            </Link>
            , a project made for the 2022 Congressional App Challenge with the
            goal of helping educators create customizable programming exercises.
            We were among the top 5 in our district, but felt there needed to be
            a change. After taking a step back to re-evaluate, we realized that
            the platform could be something more—it could be a comprehensive
            solution for teaching programming. <br />
            <br />
            After a brief hiatus, we came back to the drawing board and decided
            to refresh OctiLearn, leading to the creation of Sqil, a fully
            integrated learning management system designed specifically for
            educators teaching programming. The development of Sqil goes beyond
            convenience—it’s about bridging the digital divide. With Sqil, we
            aim to remove the barriers in programming education by providing a
            simple, intuitive system that enables teachers to focus on what
            matters most: educating their students.
          </Text>
        </GridCol>
      </Grid>

      <Title style={{ textAlign: "center" }} mb="sm">
        Our Team
      </Title>
      <Grid px={rem(300)} gutter={rem(300)}>
        <GridCol span={6}>
          <Stack gap={0}>
            <Image src="/krit.jpg" />
            <Text size="lg" fw={500} pt={0}>
              Krit Dass
            </Text>
            <Text size="sm" c="dimmed">
              Co-founder & Frontend Developer
            </Text>
            <Text size="xs" mt="sm" fw={300}>
              Through Sqil, Krit combines his love for computer science with a
              drive to help others. While tutoring students, he noticed the lack
              of accessible and flexible tools for learning programming, which
              inspired him to co-found Sqil. Now, he focuses on creating
              intuitive frontend designs that make courses more approachable for
              both educators and students. Krit is passionate about using
              technology to close educational gaps and make programming more
              inclusive. In his free time, he’s found designing his own
              programming language, playing guitar, or reading on his Kindle.
            </Text>
          </Stack>
        </GridCol>
        <GridCol span={6}>
          <Stack gap={0}>
            <Image src="/krish.jpg" mb={0} pb={0} />

            <Text size="lg" fw={500} pt={0}>
              Krish Kapoor
            </Text>
            <Text size="sm" c="dimmed">
              Co-founder & Backend Developer
            </Text>
            <Text size="xs" mt="sm" fw={300}>
              In leading his school's Robotics team, Krish soon realized that
              many of his members struggled to access free, high-quality
              programming resources. Driven by a passion for making computer
              science education accessible to anyone, he now develops the
              backend for Sqil, making it capable of compiling over 40
              programming languages. Through Sqil, Krish isn't just honing his
              skills—he's empowering others to do the same. When he's not
              coding, you can find Krish playing the piano, stargazing, or
              gaming on his Switch.
            </Text>
          </Stack>
        </GridCol>
      </Grid>
    </>
  );
}

export default About;
