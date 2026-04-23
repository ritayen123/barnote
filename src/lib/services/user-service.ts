import { db } from "../db";
import type { User, OnboardingAnswer, UnlockableFeature } from "../types";
import { UNLOCK_MILESTONES } from "../types";
import { v4 as uuidv4 } from "uuid";
import { generateInitialVector } from "../recommendation/vector";

const CURRENT_USER_KEY = "barnote_current_user";

export const userService = {
  async register(username: string, firebaseUid?: string): Promise<User> {
    if (!username.trim()) {
      throw new Error("暱稱不能為空");
    }

    const user: User = {
      id: uuidv4(),
      username: username.trim(),
      firebaseUid,
      createdAt: new Date().toISOString(),
      onboardingVector: [],
      tasteVector: [],
      recordCount: 0,
      unlockedFeatures: [],
    };

    try {
      await db.users.add(user);
    } catch {
      throw new Error("建立帳號失敗，請再試一次");
    }

    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  },

  async login(username: string): Promise<User | null> {
    if (!username.trim()) return null;
    try {
      const user = await db.users.where("username").equals(username.trim()).first();
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, user.id);
      }
      return user || null;
    } catch {
      return null;
    }
  },

  async getByFirebaseUid(uid: string): Promise<User | null> {
    try {
      const user = await db.users.where("firebaseUid").equals(uid).first();
      return user || null;
    } catch {
      return null;
    }
  },

  async loginByFirebaseUid(uid: string): Promise<User | null> {
    const user = await this.getByFirebaseUid(uid);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
    }
    return user;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const id = localStorage.getItem(CURRENT_USER_KEY);
      if (!id) return null;
      return (await db.users.get(id)) || null;
    } catch {
      return null;
    }
  },

  async completeOnboarding(answers: OnboardingAnswer): Promise<User | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    try {
      const vector = generateInitialVector(answers);
      await db.users.update(user.id, {
        onboardingVector: vector,
        tasteVector: vector,
      });
      return this.getCurrentUser();
    } catch {
      return null;
    }
  },

  async updateTasteVector(vector: number[]): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;
    try {
      await db.users.update(user.id, { tasteVector: vector });
    } catch {
      // Silent fail
    }
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

    try {
      await db.users.update(user.id, {
        recordCount: newCount,
        unlockedFeatures: newFeatures,
      });
    } catch {
      return null;
    }

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

  async exportData(): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("未登入");

    const records = await db.records.where("userId").equals(user.id).toArray();
    const bars = await db.bars.toArray();

    return JSON.stringify({ user, records, bars }, null, 2);
  },
};
