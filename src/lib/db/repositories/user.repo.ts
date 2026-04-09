import { db } from '$lib/db';
import type { UserProfile } from '$lib/types/user';

export const userRepo = {
  async get(): Promise<UserProfile | undefined> {
    return db.userProfile.toCollection().first();
  },

  async create(profile: UserProfile): Promise<string> {
    return db.userProfile.add(profile);
  },

  async update(profile: UserProfile): Promise<void> {
    await db.userProfile.put(profile);
  },

  async delete(id: string): Promise<void> {
    await db.userProfile.delete(id);
  }
};
