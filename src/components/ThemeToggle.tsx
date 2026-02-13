"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-lg transition-all hover:border-primary-light"
      aria-label={dark ? "Passer en mode jour" : "Passer en mode nuit"}
      title={dark ? "Mode jour" : "Mode nuit"}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
