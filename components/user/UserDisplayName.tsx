import React, { useState, useEffect } from "react";
import { Text, TextProps } from "@chakra-ui/react";
import { getUserDisplayName } from "../../lib/user-profile-service";

interface UserDisplayNameProps extends TextProps {
  fallback?: string;
}

export function UserDisplayName({ fallback = "User", ...textProps }: UserDisplayNameProps) {
  const [displayName, setDisplayName] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDisplayName = async () => {
      try {
        setIsLoading(true);
        const name = await getUserDisplayName();
        setDisplayName(name || fallback);
      } catch (error) {
        console.error("Error loading user display name:", error);
        setDisplayName(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    loadDisplayName();
  }, [fallback]);

  if (isLoading) {
    return <Text {...textProps} opacity={0.7}>Loading...</Text>;
  }

  return <Text {...textProps}>{displayName}</Text>;
}