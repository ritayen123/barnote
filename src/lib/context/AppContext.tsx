"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { userService } from "../services/user-service";
import { cocktailService } from "../services/cocktail-service";

interface AppContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const u = await userService.getCurrentUser();
    setUser(u);
  }, []);

  useEffect(() => {
    async function init() {
      await cocktailService.init();
      await refreshUser();
      setLoading(false);
    }
    init();
  }, [refreshUser]);

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
