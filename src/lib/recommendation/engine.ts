import type { Cocktail } from "../types";
import { cocktailToVector, cosineSimilarity } from "./vector";

export interface Recommendation {
  cocktail: Cocktail;
  similarity: number;
}

export function getComfortRecommendations(
  userVector: number[],
  cocktails: Cocktail[],
  recordedIds: string[],
  limit: number = 3
): Recommendation[] {
  return cocktails
    .filter((c) => !recordedIds.includes(c.id))
    .map((cocktail) => ({
      cocktail,
      similarity: cosineSimilarity(userVector, cocktailToVector(cocktail)),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export function getExploreRecommendations(
  userVector: number[],
  cocktails: Cocktail[],
  recordedIds: string[],
  triedTags: string[],
  limit: number = 3
): Recommendation[] {
  return cocktails
    .filter((c) => !recordedIds.includes(c.id))
    .map((cocktail) => ({
      cocktail,
      similarity: cosineSimilarity(userVector, cocktailToVector(cocktail)),
      hasNewTag: cocktail.flavorTags.some((tag) => !triedTags.includes(tag)),
    }))
    .filter((r) => r.similarity >= 0.7 && r.similarity <= 0.85 && r.hasNewTag)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
