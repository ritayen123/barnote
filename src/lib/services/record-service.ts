import { db } from "../db";
import type { DrinkRecord } from "../types";
import { v4 as uuidv4 } from "uuid";
import { userService } from "./user-service";
import { updateTasteVector } from "../recommendation/vector";

export const recordService = {
  async create(
    data: Omit<DrinkRecord, "id" | "userId" | "recordedAt" | "isPublic">
  ): Promise<{ record: DrinkRecord; unlockedFeature: string | null }> {
    const user = await userService.getCurrentUser();
    if (!user) throw new Error("Not logged in");

    const record: DrinkRecord = {
      ...data,
      id: uuidv4(),
      userId: user.id,
      recordedAt: new Date().toISOString(),
      isPublic: false,
    };

    await db.records.add(record);

    // Update taste vector based on rating
    if (record.overallRating !== 3) {
      const newVector = updateTasteVector(user.tasteVector, record);
      await userService.updateTasteVector(newVector);
    }

    const unlockedFeature = await userService.incrementRecordCount();

    return { record, unlockedFeature };
  },

  async getAll(): Promise<DrinkRecord[]> {
    const user = await userService.getCurrentUser();
    if (!user) return [];
    return db.records
      .where("userId")
      .equals(user.id)
      .reverse()
      .sortBy("recordedAt");
  },

  async getById(id: string): Promise<DrinkRecord | undefined> {
    return db.records.get(id);
  },

  async toggleVisibility(id: string): Promise<void> {
    const record = await db.records.get(id);
    if (record) {
      await db.records.update(id, { isPublic: !record.isPublic });
    }
  },

  async getCount(): Promise<number> {
    const user = await userService.getCurrentUser();
    if (!user) return 0;
    return db.records.where("userId").equals(user.id).count();
  },

  async getByBarId(barId: string): Promise<DrinkRecord[]> {
    const user = await userService.getCurrentUser();
    if (!user) return [];
    return db.records
      .where(["userId", "barId"])
      .equals([user.id, barId])
      .toArray();
  },
};
