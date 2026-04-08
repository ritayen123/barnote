"use client";

interface ProgressBarProps {
  current: number;
  milestones: number[];
  label?: string;
}

export default function ProgressBar({ current, milestones, label }: ProgressBarProps) {
  const maxMilestone = milestones[milestones.length - 1];
  const percentage = Math.min((current / maxMilestone) * 100, 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">{label}</span>
          <span className="text-accent font-medium">{current} 筆</span>
        </div>
      )}
      <div className="relative h-2 bg-bg-input rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        {milestones.map((m) => (
          <div
            key={m}
            className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 ${
              current >= m
                ? "bg-accent border-accent"
                : "bg-bg-secondary border-border"
            }`}
            style={{ left: `${(m / maxMilestone) * 100}%`, transform: "translate(-50%, -50%)" }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        {milestones.map((m) => (
          <span key={m} className={current >= m ? "text-accent" : ""}>{m}</span>
        ))}
      </div>
    </div>
  );
}
