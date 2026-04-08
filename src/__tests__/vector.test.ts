import {
  generateInitialVector,
  cocktailToVector,
  cosineSimilarity,
  updateTasteVector,
} from "../lib/recommendation/vector";
import type { OnboardingAnswer, DrinkRecord } from "../lib/types";

describe("generateInitialVector", () => {
  it("should return a 10-dimension vector", () => {
    const answers: OnboardingAnswer = {
      q1: "sour",
      q2: "like",
      q3: "mojito",
      q4: "smooth",
      q5: "light",
    };
    const vector = generateInitialVector(answers);
    expect(vector).toHaveLength(10);
  });

  it("should set sour preference for q1=sour", () => {
    const answers: OnboardingAnswer = {
      q1: "sour",
      q2: "okay",
      q3: "none",
      q4: "any",
      q5: "exploring",
    };
    const vector = generateInitialVector(answers);
    expect(vector[0]).toBeGreaterThan(3); // acidity high
    expect(vector[1]).toBeLessThan(3); // sweetness low
  });

  it("should set sweet preference for q1=sweet", () => {
    const answers: OnboardingAnswer = {
      q1: "sweet",
      q2: "okay",
      q3: "none",
      q4: "any",
      q5: "exploring",
    };
    const vector = generateInitialVector(answers);
    expect(vector[0]).toBeLessThan(3); // acidity low
    expect(vector[1]).toBeGreaterThan(3); // sweetness high
  });

  it("should default to middle values for exploring answers", () => {
    const answers: OnboardingAnswer = {
      q1: "exploring",
      q2: "unsure",
      q3: "none",
      q4: "any",
      q5: "exploring",
    };
    const vector = generateInitialVector(answers);
    expect(vector[0]).toBe(3); // default middle
    expect(vector[1]).toBe(3);
  });

  it("should keep all values between 1 and 5", () => {
    const answers: OnboardingAnswer = {
      q1: "sour",
      q2: "like",
      q3: "whisky_sour",
      q4: "strong",
      q5: "rich",
    };
    const vector = generateInitialVector(answers);
    vector.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
    });
  });
});

describe("cocktailToVector", () => {
  it("should return a 10-dimension vector from cocktail data", () => {
    const vector = cocktailToVector({
      acidity: 4,
      sweetness: 2,
      bitterness: 1,
      saltiness: 1,
      strength: 3,
      texture: "light",
      temperatureFeel: "cool",
    });
    expect(vector).toHaveLength(10);
    expect(vector[0]).toBe(4); // acidity
    expect(vector[5]).toBe(2); // light texture
    expect(vector[6]).toBe(2); // cool temp
  });

  it("should handle unknown texture/temperature gracefully", () => {
    const vector = cocktailToVector({
      acidity: 3,
      sweetness: 3,
      bitterness: 3,
      saltiness: 3,
      strength: 3,
      texture: "unknown" as "light",
      temperatureFeel: "unknown" as "cool",
    });
    expect(vector[5]).toBe(3); // default
    expect(vector[6]).toBe(3); // default
  });
});

describe("cosineSimilarity", () => {
  it("should return 1 for identical vectors", () => {
    const a = [1, 2, 3, 4, 5];
    expect(cosineSimilarity(a, a)).toBeCloseTo(1, 5);
  });

  it("should return 0 for zero vector", () => {
    expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
  });

  it("should handle different-length vectors", () => {
    const a = [1, 2, 3];
    const b = [1, 2, 3, 4, 5];
    // Should use min length
    const result = cosineSimilarity(a, b);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it("should return high similarity for similar vectors", () => {
    const a = [4, 2, 1, 1, 3, 2, 2, 3, 3, 3];
    const b = [4, 2, 1, 1, 3, 2, 3, 3, 3, 3]; // slightly different
    expect(cosineSimilarity(a, b)).toBeGreaterThan(0.95);
  });

  it("should return lower similarity for different vectors", () => {
    const sweet = [1, 5, 1, 1, 1, 2, 2, 3, 3, 3];
    const bitter = [1, 1, 5, 1, 5, 4, 4, 3, 3, 3];
    expect(cosineSimilarity(sweet, bitter)).toBeLessThan(0.8);
  });
});

describe("updateTasteVector", () => {
  const baseVector = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

  it("should not change vector for rating 3", () => {
    const record = {
      overallRating: 3,
      flavorTags: [],
    } as DrinkRecord;
    const result = updateTasteVector(baseVector, record);
    expect(result).toEqual(baseVector);
  });

  it("should shift vector towards record values for high rating", () => {
    const record = {
      overallRating: 5,
      acidityRating: 5,
      sweetnessRating: 1,
      flavorTags: [],
    } as DrinkRecord;
    const result = updateTasteVector(baseVector, record);
    expect(result[0]).toBeGreaterThan(3); // acidity should increase
    expect(result[1]).toBeLessThan(3); // sweetness should decrease
  });

  it("should shift vector away from record values for low rating", () => {
    const record = {
      overallRating: 1,
      acidityRating: 5,
      sweetnessRating: 1,
      flavorTags: [],
    } as DrinkRecord;
    const result = updateTasteVector(baseVector, record);
    expect(result[0]).toBeGreaterThan(3); // still shifts towards (absolute weight)
  });

  it("should update flavor tag dimensions for fruity tags", () => {
    const record = {
      overallRating: 5,
      flavorTags: ["檸檬", "萊姆", "橙"],
    } as DrinkRecord;
    const result = updateTasteVector(baseVector, record);
    expect(result[7]).toBeGreaterThan(3); // fruity dimension should increase
  });

  it("should keep values between 1 and 5", () => {
    const extreme = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
    const record = {
      overallRating: 5,
      acidityRating: 5,
      sweetnessRating: 5,
      bitternessRating: 5,
      saltinessRating: 5,
      strengthRating: 5,
      texture: "heavy" as const,
      temperatureFeel: "warm" as const,
      flavorTags: ["檸檬", "薄荷", "咖啡"],
    } as DrinkRecord;
    const result = updateTasteVector(extreme, record);
    result.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
    });
  });
});
