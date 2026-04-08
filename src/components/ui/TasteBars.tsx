"use client";

import type { Cocktail } from "../../lib/types";

interface TasteBarsProps {
  cocktail: Cocktail;
}

const dimensions = [
  { key: "acidity" as const, label: "酸" },
  { key: "sweetness" as const, label: "甜" },
  { key: "bitterness" as const, label: "苦" },
  { key: "strength" as const, label: "烈" },
];

export default function TasteBars({ cocktail }: TasteBarsProps) {
  return (
    <div className="flex gap-3">
      {dimensions.map((d) => {
        const value = cocktail[d.key];
        return (
          <div key={d.key} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-text-muted">{d.label}</span>
            <div className="flex flex-col-reverse gap-[2px]">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-[3px] rounded-full ${
                    level <= value ? "bg-accent" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
