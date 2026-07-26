"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl border-2 border-gray-4 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        size={18}
        className="absolute transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-amber-500"
      />
      <Moon
        size={18}
        className="absolute transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-violet-400"
      />
    </button>
  );
}
