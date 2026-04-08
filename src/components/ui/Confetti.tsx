"use client";

import { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export default function Confetti({ active, duration = 2500 }: ConfettiProps) {
  const [particles, setParticles] = useState<
    { id: number; left: number; color: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ["#d4a053", "#e0b46a", "#fbbf24", "#f5f5f5", "#8b5e3c", "#6ba3be"];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      size: 4 + Math.random() * 8,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [active, duration]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
