"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getProfile } from "../actions";
import { Card, Avatar, Text } from "@mantine/core";

export interface ProfileData {
  email: string;
  msg: string;
  name: string;
  pfp: string;
}

function Profile() {
  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return (
    <Card withBorder padding="xl" radius="md">
      <Avatar src={profile?.pfp} size={80} radius={80} mx="auto" />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {profile?.name}
      </Text>
      <Text fz="xs" c="dimmed" mt="xs">
        {profile?.email}
      </Text>
    </Card>
  );
}

export default Profile;
