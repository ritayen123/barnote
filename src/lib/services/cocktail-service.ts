import { db } from "../db";
import type { Cocktail } from "../types";
import { cocktailsData } from "../../data/cocktails";

export const cocktailService = {
  async init(): Promise<void> {
    const count = await db.cocktails.count();
    if (count === 0) {
      await db.cocktails.bulkAdd(cocktailsData);
    }
  },

  async getAll(): Promise<Cocktail[]> {
    return db.cocktails.toArray();
  },

  async getById(id: string): Promise<Cocktail | undefined> {
    return db.cocktails.get(id);
  },

  async search(query: string): Promise<Cocktail[]> {
    const q = query.toLowerCase();
    const all = await db.cocktails.toArray();
    return all.filter(
      (c) =>
        c.nameEn.toLowerCase().includes(q) ||
        c.nameZh.includes(q) ||
        c.baseSpirit.toLowerCase().includes(q)
    );
  },

  async getByIds(ids: string[]): Promise<Cocktail[]> {
    const results = await db.cocktails.bulkGet(ids);
    return results.filter((c): c is Cocktail => c !== undefined);
  },
};
