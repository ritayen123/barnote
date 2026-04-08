"use client";

import { AppProvider } from "../../lib/context/AppContext";
import { ToastProvider } from "../../components/ui/Toast";
import BottomNav from "../../components/ui/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ToastProvider>
        <div className="pb-20">
          {children}
        </div>
        <BottomNav />
      </ToastProvider>
    </AppProvider>
  );
}
