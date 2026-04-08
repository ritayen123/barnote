import { db } from "../db";
import type { Bar } from "../types";
import { v4 as uuidv4 } from "uuid";

export const barService = {
  async create(data: { name: string; address?: string; city?: string }): Promise<Bar> {
    const bar: Bar = {
      id: uuidv4(),
      name: data.name,
      address: data.address,
      city: data.city,
      reviewCount: 0,
      createdBy: "user",
    };
    await db.bars.add(bar);
    return bar;
  },

  async getAll(): Promise<Bar[]> {
    return db.bars.toArray();
  },

  async getById(id: string): Promise<Bar | undefined> {
    return db.bars.get(id);
  },

  async search(query: string): Promise<Bar[]> {
    const q = query.toLowerCase();
    const all = await db.bars.toArray();
    return all.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.address && b.address.toLowerCase().includes(q)) ||
        (b.city && b.city.toLowerCase().includes(q))
    );
  },

  async updateStats(
    barId: string,
    ambiance: number,
    service: number,
    food: number
  ): Promise<void> {
    const bar = await db.bars.get(barId);
    if (!bar) return;

    const count = bar.reviewCount + 1;
    const avg = (prev: number | undefined, val: number) =>
      prev ? (prev * bar.reviewCount + val) / count : val;

    await db.bars.update(barId, {
      avgAmbiance: avg(bar.avgAmbiance, ambiance),
      avgService: avg(bar.avgService, service),
      avgFood: avg(bar.avgFood, food),
      reviewCount: count,
    });
  },

  // Placeholder for future Google Places API integration
  async searchGooglePlaces(_query: string): Promise<Bar[]> {
    // TODO: Integrate Google Places API
    // const response = await fetch(`/api/places/search?q=${query}`);
    // return response.json();
    return [];
  },
};
