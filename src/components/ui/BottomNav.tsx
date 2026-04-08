"use client";

import { usePathname, useRouter } from "next/navigation";
import { HomeIcon, PlusCircleIcon, UserIcon } from "./Icons";

const navItems = [
  { path: "/home", label: "首頁", Icon: HomeIcon },
  { path: "/record", label: "記錄", Icon: PlusCircleIcon },
  { path: "/profile", label: "我的", Icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-md border-t border-border z-50 pb-safe-bottom">
      <div className="max-w-[430px] mx-auto flex">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors ${
                isActive ? "text-accent" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <item.Icon size={22} color={isActive ? "#d4a053" : "#666"} />
              <span className={`text-[10px] ${isActive ? "text-accent font-medium" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
