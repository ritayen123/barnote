"use client";

import { AppProvider } from "../../lib/context/AppContext";
import BottomNav from "../../components/ui/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="pb-20">
        {children}
      </div>
      <BottomNav />
    </AppProvider>
  );
}
