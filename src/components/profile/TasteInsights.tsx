"use client";

import { TrophyIcon, CompassIcon, BarChartIcon } from "../ui/Icons";

interface TasteInsightsProps {
  vector: number[];
  recordCount: number;
}

export default function TasteInsights({ vector, recordCount }: TasteInsightsProps) {
  if (recordCount < 5) return null;

  const dimensions = ["酸度", "甜度", "苦度", "鹹度", "烈度", "口感", "溫度"];
  const sorted = dimensions
    .map((name, i) => ({ name, value: vector[i] || 3 }))
    .sort((a, b) => b.value - a.value);

  const top = sorted[0];
  const low = sorted[sorted.length - 1];

  const getDescription = (dim: string, value: number): string => {
    const high = value >= 4;
    const descriptions: Record<string, [string, string]> = {
      酸度: ["你喜歡帶有明顯酸度的調酒", "你偏好不太酸的口味"],
      甜度: ["你是甜味愛好者", "你不太喜歡甜味"],
      苦度: ["你能欣賞苦味的層次", "苦味不是你的菜"],
      鹹度: ["你喜歡帶有鹹味的風格", "你偏好不帶鹹味的調酒"],
      烈度: ["你喜歡酒精感明顯的調酒", "你偏好順口的調酒"],
      口感: ["你喜歡厚重濃郁的口感", "你偏好輕盈清爽的口感"],
      溫度: ["你偏好溫暖的調酒風格", "你喜歡清涼的調酒"],
    };
    return descriptions[dim]?.[high ? 0 : 1] || "";
  };

  return (
    <div className="bg-bg-card rounded-2xl p-4 space-y-4">
      <h3 className="font-bold">口味洞察</h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <div className="text-accent flex-shrink-0 mt-0.5">
            <TrophyIcon size={20} />
          </div>
          <div>
            <p className="text-text-primary">{getDescription(top.name, top.value)}</p>
            <p className="text-text-muted text-xs">{top.name}偏好值 {top.value.toFixed(1)}/5</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-accent flex-shrink-0 mt-0.5">
            <CompassIcon size={20} />
          </div>
          <div>
            <p className="text-text-primary">{getDescription(low.name, low.value)}</p>
            <p className="text-text-muted text-xs">{low.name}偏好值 {low.value.toFixed(1)}/5</p>
          </div>
        </div>

        {recordCount >= 10 && (
          <div className="flex items-start gap-3">
            <div className="text-accent flex-shrink-0 mt-0.5">
              <BarChartIcon size={20} />
            </div>
            <p className="text-text-primary">
              你已經記錄了 {recordCount} 杯調酒，口味圖譜越來越精準了！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
