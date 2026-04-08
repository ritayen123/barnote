"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckIcon, XIcon } from "./Icons";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (text: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((text: string, type: "success" | "error" | "info" = "info") => {
    const id = nextId++;
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[90%] max-w-[400px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg animate-[fadeSlideIn_0.3s_ease-out] ${
              msg.type === "success"
                ? "bg-success/90 text-bg-primary"
                : msg.type === "error"
                ? "bg-danger/90 text-white"
                : "bg-bg-card/95 text-text-primary border border-border"
            }`}
          >
            {msg.type === "success" && <CheckIcon size={16} />}
            {msg.type === "error" && <XIcon size={16} />}
            <span className="flex-1">{msg.text}</span>
            <button
              onClick={() => setMessages((prev) => prev.filter((m) => m.id !== msg.id))}
              className="opacity-60 hover:opacity-100"
            >
              <XIcon size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
