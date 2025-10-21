"use client"

import React, { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { UserProfileSetup } from "../components/user/UserProfileSetup";
import { hasUserProfile } from "../lib/user-profile-service";

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
    return <div>Loading...</div>;
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
