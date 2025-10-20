import { getCurrentUser, type AuthUser } from 'aws-amplify/auth';

// Simple hook to get current user info when needed
export async function getCurrentUserInfo(): Promise<AuthUser> {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw new Error('User not authenticated');
  }
}

// Get user ID specifically
export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUserInfo();
  return user.userId;
}

// Get user display name (username or email as fallback)
export async function getCurrentUserDisplayName(): Promise<string> {
  const user = await getCurrentUserInfo();
  return user.username || user.signInDetails?.loginId || 'User';
}