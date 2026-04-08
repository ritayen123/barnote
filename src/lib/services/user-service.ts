import { db } from "../db";
import type { User, OnboardingAnswer, UnlockableFeature } from "../types";
import { UNLOCK_MILESTONES } from "../types";
import { v4 as uuidv4 } from "uuid";
import { generateInitialVector } from "../recommendation/vector";

const CURRENT_USER_KEY = "sipnote_current_user";

export const userService = {
  async register(username: string): Promise<User> {
    const user: User = {
      id: uuidv4(),
      username,
      createdAt: new Date().toISOString(),
      onboardingVector: [],
      tasteVector: [],
      recordCount: 0,
      unlockedFeatures: [],
    };
    await db.users.add(user);
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  },

  async login(username: string): Promise<User | null> {
    const user = await db.users.where("username").equals(username).first();
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
    }
    return user || null;
  },

  async getCurrentUser(): Promise<User | null> {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    if (!id) return null;
    return (await db.users.get(id)) || null;
  },

  async completeOnboarding(answers: OnboardingAnswer): Promise<User | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const vector = generateInitialVector(answers);
    await db.users.update(user.id, {
      onboardingVector: vector,
      tasteVector: vector,
    });

    return this.getCurrentUser();
  },

  async updateTasteVector(vector: number[]): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;
    await db.users.update(user.id, { tasteVector: vector });
  },

  async incrementRecordCount(): Promise<UnlockableFeature | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const newCount = user.recordCount + 1;
    const newFeatures = [...user.unlockedFeatures];
    let unlocked: UnlockableFeature | null = null;

    if (UNLOCK_MILESTONES[newCount] && !newFeatures.includes(UNLOCK_MILESTONES[newCount])) {
      unlocked = UNLOCK_MILESTONES[newCount];
      newFeatures.push(unlocked);
    }

    await db.users.update(user.id, {
      recordCount: newCount,
      unlockedFeatures: newFeatures,
    });

    return unlocked;
  },

  async hasFeature(feature: UnlockableFeature): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;
    return user.unlockedFeatures.includes(feature);
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  },
};
