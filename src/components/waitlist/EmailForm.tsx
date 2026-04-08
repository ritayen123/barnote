"use client";

import { useState, FormEvent } from "react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("請輸入 Email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("請輸入有效的 Email 格式");
      return;
    }

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("sipnote_waitlist") || "[]");
      if (!existing.includes(trimmed)) {
        existing.push(trimmed);
        localStorage.setItem("sipnote_waitlist", JSON.stringify(existing));
      }
    } catch {
      // If localStorage fails, still show success
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-6 px-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-accent">
          已加入等待名單！
        </p>
        <p className="text-sm text-text-secondary mt-2">
          我們會在上線時第一時間通知你
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          className="w-full px-4 py-3.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
        />
      </div>
      {error && (
        <p className="text-danger text-xs px-1">{error}</p>
      )}
      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-accent text-bg-primary font-semibold text-sm hover:bg-accent-hover active:scale-[0.98] transition-all duration-150"
      >
        加入等待名單
      </button>
    </form>
  );
}
