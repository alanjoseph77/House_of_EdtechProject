import profileData from '../data/profile.json';
import type { UserProfile } from '../types/profile';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProfile(): Promise<UserProfile> {
  await delay(1000);
  return profileData as UserProfile;
}
