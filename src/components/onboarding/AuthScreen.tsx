"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { CocktailIcon, LockIcon } from "../ui/Icons";
import { userService } from "../../lib/services/user-service";

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const user = await userService.login(username.trim());
        if (!user) {
          setError("找不到這個帳號");
          setLoading(false);
          return;
        }
      } else {
        await userService.register(username.trim());
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤，請再試一次");
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
      <div className="text-center mb-14 relative z-10">
        <div className="flex justify-center mb-5">
          <CocktailIcon size={48} color="#d4a053" />
        </div>
        <h1 className="text-4xl font-bold text-accent tracking-tight">SipNote</h1>
        <p className="text-text-secondary mt-3 text-lg">每一杯，都讓你更了解自己</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="輸入你的暱稱"
            className="w-full px-4 py-3.5 bg-bg-input border border-border rounded-xl text-text-primary text-center text-lg placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            maxLength={20}
            autoFocus
          />
        </div>

        {error && <p className="text-danger text-sm text-center">{error}</p>}

        <Button type="submit" fullWidth size="lg" disabled={!username.trim() || loading}>
          {loading ? "處理中..." : isLogin ? "登入" : "開始使用"}
        </Button>
      </form>

      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError("");
        }}
        className="text-text-muted text-sm mt-8 text-center hover:text-accent transition-colors relative z-10"
      >
        {isLogin ? "還沒有帳號？建立帳號" : "已有帳號？登入"}
      </button>

      {/* Social login placeholder */}
      <div className="relative z-10 mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-muted text-xs">或</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex gap-3">
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-card border border-border text-text-muted text-sm opacity-50 cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-1.15.69-2.58 1.09-4.05 1.09-3.36 0-6.2-2.14-7.22-5.12a7.98 7.98 0 01-.41-2.53c0-1.06.21-2.07.58-3 1.14-2.58 3.68-4.38 6.64-4.55h.41c1.36 0 2.63.4 3.72 1.09l-1.58 1.58A4.69 4.69 0 0013 8.01c-2.42.13-4.39 1.88-4.87 4.18a5.05 5.05 0 00-.09.93c0 .39.05.77.14 1.13.57 2.18 2.48 3.82 4.82 3.95 1.49.06 2.82-.42 3.78-1.29.67-.61 1.12-1.41 1.3-2.31h-4.06V13h5.83c.08.46.12.95.12 1.45 0 2.28-.82 4.2-2.24 5.55l-.67.28z" />
            </svg>
            Google
          </button>
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-card border border-border text-text-muted text-sm opacity-50 cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <LockIcon size={12} color="#666666" />
          <p className="text-text-muted text-xs text-center">
            Apple / Google 登入 — 即將推出
          </p>
        </div>
      </div>
    </div>
  );
}
