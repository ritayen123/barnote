"use client";

import { useState, type ReactNode } from "react";
import type { OnboardingAnswer } from "../../lib/types";
import Button from "../ui/Button";
import {
  CocktailIcon,
  CompassIcon,
  HeartIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../ui/Icons";

interface OnboardingFlowProps {
  onComplete: (answers: OnboardingAnswer) => void;
}

/* --- Inline SVG helper icons (not in shared Icons.tsx) --- */

function LemonIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 2.5c2.8 2.8 2.8 7.3 0 10.1L12 18.2l-5.5-5.6c-2.8-2.8-2.8-7.3 0-10.1 2.8-2.8 7.3-2.8 10.1 0l.9.9.9-.9z" />
      <path d="M12 7v5" />
      <path d="M9.5 9.5L12 12l2.5-2.5" />
    </svg>
  );
}

function HoneyDropIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z" />
    </svg>
  );
}

function BalanceIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5 7l7-4 7 4" />
      <path d="M3 13l4-6 4 6H3z" />
      <path d="M13 13l4-6 4 6h-8z" />
    </svg>
  );
}

function BitterIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15c.5-1 1.5-2 4-2s3.5 1 4 2" />
      <circle cx="9" cy="9" r="1" fill={color} />
      <circle cx="15" cy="9" r="1" fill={color} />
    </svg>
  );
}

function ThumbUpIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 00-6 0v1H6a2 2 0 00-2 2v8a2 2 0 002 2h10.3a2 2 0 002-1.7l1.4-8a2 2 0 00-2-2.3H14z" />
    </svg>
  );
}

function WaveIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
      <path d="M2 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
    </svg>
  );
}

function FlameIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-2 8-6 8-12 0-2.5-2-4-4-4-1 0-2 .5-2.5 1.5L12 10l-1.5-2.5C10 6.5 9 6 8 6c-2 0-4 1.5-4 4 0 6 4 10 8 12z" />
    </svg>
  );
}

function FeatherIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function LayersIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

/* --- Option icon mapping --- */

const optionIcons: Record<string, Record<string, ReactNode>> = {
  q1: {
    sour: <LemonIcon size={18} />,
    sweet: <HoneyDropIcon size={18} />,
    middle: <BalanceIcon size={18} />,
    exploring: <CompassIcon size={18} />,
  },
  q2: {
    dislike: <BitterIcon size={18} />,
    okay: <ThumbUpIcon size={18} />,
    like: <HeartIcon size={18} />,
    unsure: <CompassIcon size={18} />,
  },
  q3: {},
  q4: {
    smooth: <WaveIcon size={18} />,
    middle: <BalanceIcon size={18} />,
    strong: <FlameIcon size={18} />,
    any: <StarIcon size={18} />,
  },
  q5: {
    light: <FeatherIcon size={18} />,
    middle: <BalanceIcon size={18} />,
    rich: <LayersIcon size={18} />,
    exploring: <CompassIcon size={18} />,
  },
};

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
  // step -1 = welcome screen, 0..4 = questions
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswer>>({});
  const [animating, setAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  const isWelcome = step === -1;
  const questionIndex = step;
  const current = !isWelcome ? questions[questionIndex] : null;
  const isLast = questionIndex === questions.length - 1;

  /* Transition helper */
  const transitionTo = (nextStep: number, direction: "left" | "right" = "left") => {
    setSlideDirection(direction);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 250);
  };

  const handleSelect = (value: string) => {
    if (!current) return;
    const newAnswers = { ...answers, [current.key]: value };
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers as OnboardingAnswer);
    } else {
      setTimeout(() => transitionTo(step + 1, "left"), 200);
    }
  };

  const handleSkipAll = () => {
    const defaultAnswers: OnboardingAnswer = {
      q1: "exploring",
      q2: "unsure",
      q3: "none",
      q4: "any",
      q5: "exploring",
    };
    onComplete(defaultAnswers);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 relative overflow-hidden">
      {/* Transition styles */}
      <style jsx>{`
        .slide-container {
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .slide-out-left {
          opacity: 0;
          transform: translateX(-30px);
        }
        .slide-out-right {
          opacity: 0;
          transform: translateX(30px);
        }
        .slide-in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* Welcome screen */}
      {isWelcome && (
        <div
          className={`flex-1 flex flex-col items-center justify-center slide-container ${
            animating ? "slide-out-left" : "slide-in"
          }`}
        >
          <div className="mb-6 opacity-80">
            <CocktailIcon size={56} color="#d4a053" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-3">
            讓我們花 30 秒認識你的口味
          </h1>
          <p className="text-text-secondary text-center mb-10 max-w-xs">
            回答幾個簡單問題，我們就能推薦最適合你的調酒
          </p>
          <Button
            size="lg"
            onClick={() => transitionTo(0, "left")}
            className="px-12"
          >
            <span className="flex items-center gap-2">
              開始
              <ChevronRightIcon size={18} />
            </span>
          </Button>
          <button
            onClick={handleSkipAll}
            className="text-text-muted text-sm mt-8 hover:text-text-secondary transition-colors"
          >
            全部跳過，直接開始
          </button>
        </div>
      )}

      {/* Question flow */}
      {!isWelcome && current && (
        <>
          {/* Progress */}
          <div className="flex gap-1.5 mb-12">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i <= questionIndex ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Question content */}
          <div
            className={`flex-1 flex flex-col justify-center slide-container ${
              animating
                ? slideDirection === "left"
                  ? "slide-out-left"
                  : "slide-out-right"
                : "slide-in"
            }`}
          >
            <p className="text-text-muted text-sm mb-3">
              問題 {questionIndex + 1} / {questions.length}
            </p>
            <h2 className="text-2xl font-bold mb-10">{current.question}</h2>

            <div className="space-y-3">
              {current.options.map((option) => {
                const icon = optionIcons[current.key]?.[option.value];
                return (
                  <Button
                    key={option.value}
                    variant={
                      answers[current.key] === option.value
                        ? "primary"
                        : "secondary"
                    }
                    fullWidth
                    size="lg"
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className="flex items-center justify-center gap-2.5">
                      {icon && (
                        <span className="opacity-70">{icon}</span>
                      )}
                      {option.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex flex-col items-center gap-4 mt-6">
            {questionIndex > 0 && (
              <button
                onClick={() => transitionTo(step - 1, "right")}
                className="flex items-center gap-1 text-text-muted text-sm hover:text-text-secondary transition-colors"
              >
                <ChevronLeftIcon size={14} />
                上一題
              </button>
            )}
            <button
              onClick={handleSkipAll}
              className="text-text-muted text-xs hover:text-text-secondary transition-colors"
            >
              全部跳過，直接開始
            </button>
          </div>
        </>
      )}
    </div>
  );
}
