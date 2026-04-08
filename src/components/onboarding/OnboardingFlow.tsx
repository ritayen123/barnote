"use client";

import { useState } from "react";
import type { OnboardingAnswer } from "../../lib/types";
import Button from "../ui/Button";

interface OnboardingFlowProps {
  onComplete: (answers: OnboardingAnswer) => void;
}

const questions = [
  {
    key: "q1" as const,
    question: "你喜歡喝起來偏酸還是偏甜？",
    options: [
      { value: "sour", label: "偏酸" },
      { value: "middle", label: "中間" },
      { value: "sweet", label: "偏甜" },
      { value: "exploring", label: "還在探索" },
    ],
  },
  {
    key: "q2" as const,
    question: "你能接受苦味嗎？",
    options: [
      { value: "dislike", label: "不喜歡苦" },
      { value: "okay", label: "還好" },
      { value: "like", label: "喜歡苦" },
      { value: "unsure", label: "不確定" },
    ],
  },
  {
    key: "q3" as const,
    question: "這些你喝過最喜歡哪個？",
    options: [
      { value: "mojito", label: "Mojito" },
      { value: "whisky_sour", label: "Whisky Sour" },
      { value: "espresso_martini", label: "Espresso Martini" },
      { value: "none", label: "都沒喝過" },
      { value: "all", label: "都喜歡" },
    ],
  },
  {
    key: "q4" as const,
    question: "你喜歡酒精感明顯還是喝起來順口？",
    options: [
      { value: "smooth", label: "順口" },
      { value: "middle", label: "中間" },
      { value: "strong", label: "喜歡烈的" },
      { value: "any", label: "都可以" },
    ],
  },
  {
    key: "q5" as const,
    question: "你偏好清爽還是濃郁？",
    options: [
      { value: "light", label: "清爽" },
      { value: "middle", label: "中間" },
      { value: "rich", label: "濃郁" },
      { value: "exploring", label: "還在探索" },
    ],
  },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswer>>({});

  const current = questions[step];
  const isLast = step === questions.length - 1;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [current.key]: value };
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers as OnboardingAnswer);
    } else {
      setTimeout(() => setStep(step + 1), 200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Progress */}
      <div className="flex gap-1.5 mb-12">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-text-muted text-sm mb-3">問題 {step + 1} / {questions.length}</p>
        <h2 className="text-2xl font-bold mb-10">{current.question}</h2>

        <div className="space-y-3">
          {current.options.map((option) => (
            <Button
              key={option.value}
              variant={answers[current.key] === option.value ? "primary" : "secondary"}
              fullWidth
              size="lg"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Back */}
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="text-text-muted text-sm mt-8 hover:text-text-secondary"
        >
          ← 上一題
        </button>
      )}
    </div>
  );
}
