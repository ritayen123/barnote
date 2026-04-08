"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface TasteRadarProps {
  vector: number[];
  size?: number;
}

const dimensions = ["酸度", "甜度", "苦度", "鹹度", "烈度", "口感", "溫度"];

export default function TasteRadar({ vector, size }: TasteRadarProps) {
  const data = dimensions.map((name, i) => ({
    dimension: name,
    value: vector[i] || 3,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={size || 280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#333333" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "#a0a0a0", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name="口味"
          dataKey="value"
          stroke="#d4a053"
          fill="#d4a053"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
