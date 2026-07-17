"use client";

import { App as AntdApp, ConfigProvider, theme } from "antd";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

type AppTheme = "light" | "dark";

type ThemeContextValue = {
  appTheme: AppTheme;
  toggleTheme: () => void;
  setAppTheme: (theme: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside AppProviders");
  }

  return context;
}

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  const [appTheme, setAppThemeState] = useState<AppTheme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("eventpass-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setAppThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", appTheme);
    localStorage.setItem("eventpass-theme", appTheme);
  }, [appTheme]);

  const setAppTheme = (themeValue: AppTheme) => {
    setAppThemeState(themeValue);
  };

  const toggleTheme = () => {
    setAppThemeState((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  const contextValue = useMemo(
    () => ({
      appTheme,
      toggleTheme,
      setAppTheme,
    }),
    [appTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{
          algorithm:
            appTheme === "dark"
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 10,
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}