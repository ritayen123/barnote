"use client";

import { useState } from "react";
import Button from "../ui/Button";
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
    } catch {
      setError("發生錯誤，請再試一次");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -right-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-32 -left-16 w-40 h-40 bg-accent/3 rounded-full blur-2xl" />

      {/* Logo */}
      <div className="text-center mb-14 relative z-10">
        <div className="text-6xl mb-5 drop-shadow-lg">🍸</div>
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
    </div>
  );
}
