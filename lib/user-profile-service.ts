import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserProfileInput {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  timezone?: string;
}

export interface UpdateUserProfileInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  timezone?: string;
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const currentUser = await getCurrentUser();
    const response = await client.models.UserProfile.list({
      filter: {
        user_id: {
          eq: currentUser.userId
        }
      }
    });

    if (response.data && response.data.length > 0) {
      return response.data[0] as UserProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Create a new user profile
 */
export async function createUserProfile(profileData: CreateUserProfileInput): Promise<UserProfile | null> {
  try {
    const currentUser = await getCurrentUser();
    const now = new Date().toISOString();
    
    const response = await client.models.UserProfile.create({
      user_id: currentUser.userId,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: profileData.email,
      phone: profileData.phone,
      avatar_url: profileData.avatar_url,
      timezone: profileData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      created_at: now,
      updated_at: now,
    });

    if (response.data) {
      return response.data as UserProfile;
    }

    return null;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(profileData: UpdateUserProfileInput): Promise<UserProfile | null> {
  try {
    const currentProfile = await getCurrentUserProfile();
    if (!currentProfile) {
      throw new Error("User profile not found");
    }

    const response = await client.models.UserProfile.update({
      id: currentProfile.id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: profileData.email,
      phone: profileData.phone,
      avatar_url: profileData.avatar_url,
      timezone: profileData.timezone,
      updated_at: new Date().toISOString(),
    });

    if (response.data) {
      return response.data as UserProfile;
    }

    return null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}

/**
 * Get user display name (full name or fallback to email/username)
 */
export async function getUserDisplayName(): Promise<string> {
  try {
    const profile = await getCurrentUserProfile();
    if (profile && profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }

    // Fallback to current user info if no profile exists
    const currentUser = await getCurrentUser();
    return currentUser.username || currentUser.userId || "User";
  } catch (error) {
    console.error("Error getting user display name:", error);
    return "User";
  }
}

/**
 * Check if user has completed their profile
 */
export async function hasUserProfile(): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    return profile !== null && !!profile.first_name && !!profile.last_name;
  } catch (error) {
    console.error("Error checking user profile:", error);
    return false;
  }
}