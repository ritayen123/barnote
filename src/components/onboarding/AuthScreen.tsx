"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { CocktailIcon } from "../ui/Icons";
import { authService } from "../../lib/services/auth-service";

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await authService.signInWithGoogle();
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "登入失敗";
      if (!message.includes("popup-closed")) {
        setError("登入失敗，請再試一次");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background: linear-gradient(
            -45deg,
            rgba(212, 160, 83, 0.08),
            rgba(15, 15, 15, 1),
            rgba(184, 137, 46, 0.06),
            rgba(15, 15, 15, 1),
            rgba(212, 160, 83, 0.1),
            rgba(15, 15, 15, 1)
          );
          background-size: 400% 400%;
          animation: gradientFlow 12s ease infinite;
        }
      `}</style>
      <div className="animated-gradient absolute inset-0" />

      {/* Background decorations */}
      <div className="absolute top-20 -right-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-32 -left-16 w-40 h-40 bg-accent/3 rounded-full blur-2xl" />

      {/* Logo */}
      <div className="text-center mb-16 relative z-10">
        <div className="flex justify-center mb-5">
          <CocktailIcon size={56} color="#d4a053" />
        </div>
        <h1 className="text-4xl font-bold text-accent tracking-tight">Barnote</h1>
        <p className="text-text-secondary mt-3 text-lg">每一杯，都讓你更了解自己</p>
      </div>

      {/* Google Sign In */}
      <div className="relative z-10 space-y-4">
        {error && <p className="text-danger text-sm text-center">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-gray-800 font-medium text-base hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? "登入中..." : "使用 Google 帳號登入"}
        </button>

        <p className="text-text-muted text-xs text-center mt-6">
          登入即表示您同意我們的
          <a href="/privacy" className="text-accent hover:underline">隱私權政策</a>
        </p>
      </div>
    </div>
  );
}
