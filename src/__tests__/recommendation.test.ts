import {
  getComfortRecommendations,
  getExploreRecommendations,
} from "../lib/recommendation/engine";
import type { Cocktail } from "../lib/types";

const mockCocktails: Cocktail[] = [
  {
    id: "c001",
    nameEn: "Sweet Drink",
    nameZh: "甜飲",
    category: "test",
    baseSpirit: "Rum",
    acidity: 1,
    sweetness: 5,
    bitterness: 1,
    saltiness: 1,
    strength: 2,
    texture: "light",
    temperatureFeel: "cool",
    flavorTags: ["芒果", "椰子"],
  },
  {
    id: "c002",
    nameEn: "Bitter Drink",
    nameZh: "苦飲",
    category: "test",
    baseSpirit: "Gin",
    acidity: 1,
    sweetness: 1,
    bitterness: 5,
    saltiness: 1,
    strength: 5,
    texture: "heavy",
    temperatureFeel: "warm",
    flavorTags: ["苦艾", "藥草"],
  },
  {
    id: "c003",
    nameEn: "Sour Drink",
    nameZh: "酸飲",
    category: "test",
    baseSpirit: "Vodka",
    acidity: 5,
    sweetness: 2,
    bitterness: 1,
    saltiness: 2,
    strength: 3,
    texture: "light",
    temperatureFeel: "cool",
    flavorTags: ["檸檬", "萊姆"],
  },
  {
    id: "c004",
    nameEn: "Balanced Drink",
    nameZh: "均衡飲",
    category: "test",
    baseSpirit: "Whiskey",
    acidity: 3,
    sweetness: 3,
    bitterness: 3,
    saltiness: 1,
    strength: 3,
    texture: "medium",
    temperatureFeel: "neutral",
    flavorTags: ["橡木", "香草"],
  },
];

describe("getComfortRecommendations", () => {
  it("should return recommendations sorted by similarity", () => {
    const sweetUser = [1, 5, 1, 1, 2, 2, 2, 3, 3, 3]; // likes sweet
    const recs = getComfortRecommendations(sweetUser, mockCocktails, []);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].cocktail.nameEn).toBe("Sweet Drink");
  });

  it("should exclude already recorded cocktails", () => {
    const sweetUser = [1, 5, 1, 1, 2, 2, 2, 3, 3, 3];
    const recs = getComfortRecommendations(sweetUser, mockCocktails, ["c001"]);
    expect(recs.every((r) => r.cocktail.id !== "c001")).toBe(true);
  });

  it("should respect limit parameter", () => {
    const user = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    const recs = getComfortRecommendations(user, mockCocktails, [], 2);
    expect(recs.length).toBe(2);
  });

  it("should return empty array for empty cocktail list", () => {
    const user = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    const recs = getComfortRecommendations(user, [], []);
    expect(recs).toHaveLength(0);
  });

  it("should return similarity scores between 0 and 1", () => {
    const user = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    const recs = getComfortRecommendations(user, mockCocktails, []);
    recs.forEach((r) => {
      expect(r.similarity).toBeGreaterThanOrEqual(0);
      expect(r.similarity).toBeLessThanOrEqual(1);
    });
  });
});

describe("getExploreRecommendations", () => {
  it("should return cocktails with new flavor tags", () => {
    const user = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]; // balanced
    const triedTags = ["芒果", "椰子", "苦艾", "藥草"];
    const recs = getExploreRecommendations(user, mockCocktails, [], triedTags);
    // Should prefer cocktails with tags NOT in triedTags
    recs.forEach((r) => {
      expect(r.cocktail.flavorTags.some((t) => !triedTags.includes(t))).toBe(true);
    });
  });

  it("should only return cocktails in 70-85% similarity range", () => {
    const user = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    const recs = getExploreRecommendations(user, mockCocktails, [], []);
    recs.forEach((r) => {
      expect(r.similarity).toBeGreaterThanOrEqual(0.7);
      expect(r.similarity).toBeLessThanOrEqual(0.85);
    });
  });
});
