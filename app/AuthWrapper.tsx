"use client"

import React, { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { UserProfileSetup } from "../components/user/UserProfileSetup";
import { hasUserProfile } from "../lib/user-profile-service";
import { Box, VStack, Spinner, Text, Center } from '@chakra-ui/react';
import { Heart } from 'lucide-react';

function ProfileChecker({ children }: { children: React.ReactNode }) {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const hasProfile = await hasUserProfile();
        setShowProfileSetup(!hasProfile);
      } catch (error) {
        console.error("Error checking user profile:", error);
        // If there's an error, assume they need to set up profile
        setShowProfileSetup(true);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkUserProfile();
  }, []);

  const handleProfileCreated = async () => {
    setShowProfileSetup(false);
  };

  if (isCheckingProfile) {
    return (
      <Center minH="100vh" bg="neutral.50">
        <VStack spacing={4}>
          <Box position="relative">
            <Heart size={40} color="var(--chakra-colors-brand-500)" />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <Spinner
                size="sm"
                color="brand.500"
                thickness="2px"
                speed="0.8s"
              />
            </Box>
          </Box>
          <VStack spacing={1}>
            <Text fontSize="md" fontWeight="medium" color="brand.600">
              EnchantedDay
            </Text>
            <Text fontSize="sm" color="neutral.600">
              Preparing your experience...
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <>
      {children}
      <UserProfileSetup
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onProfileCreated={handleProfileCreated}
      />
    </>
  );
}

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authenticator>
      <ProfileChecker>
        {children}
      </ProfileChecker>
    </Authenticator>
  );
}
