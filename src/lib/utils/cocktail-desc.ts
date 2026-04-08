import type { Cocktail } from "../types";

export function getCocktailDescription(c: Cocktail): string {
  const parts: string[] = [];

  // Strength
  if (c.strength >= 4) parts.push("酒感明顯");
  else if (c.strength <= 2) parts.push("清爽順口");

  // Main taste
  const tastes: string[] = [];
  if (c.sweetness >= 4) tastes.push("偏甜");
  if (c.acidity >= 4) tastes.push("帶酸");
  if (c.bitterness >= 4) tastes.push("微苦");
  if (c.saltiness >= 3) tastes.push("帶鹹");
  if (tastes.length > 0) parts.push(tastes.join("、"));

  // Texture
  const textureMap = { light: "口感輕盈", medium: "口感適中", heavy: "口感厚重" };
  parts.push(textureMap[c.texture]);

  // Temperature
  const tempMap = { cool: "冰涼清爽", neutral: "溫度中性", warm: "溫暖醇厚" };
  parts.push(tempMap[c.temperatureFeel]);

  return parts.join("，") + "。";
}

export function getBaseDescription(baseSpirit: string): string {
  const map: Record<string, string> = {
    Whiskey: "威士忌基底",
    Gin: "琴酒基底",
    Vodka: "伏特加基底",
    Rum: "蘭姆酒基底",
    Tequila: "龍舌蘭基底",
    Brandy: "白蘭地基底",
    Multiple: "多種基酒",
    Champagne: "香檳基底",
    Wine: "葡萄酒基底",
    Liqueur: "利口酒基底",
    Beer: "啤酒基底",
    Sake: "清酒基底",
    Shochu: "燒酎基底",
  };
  return map[baseSpirit] || baseSpirit;
}
