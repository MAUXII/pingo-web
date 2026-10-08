"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Monitor, Moon, Sun } from "lucide-react";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "Sistema", icon: Monitor },
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
];

export function useTheme() {
  const [theme, setState] = useState<Theme>("system");
  useEffect(() => {
    setState(getTheme());
    const onChange = (e: Event) => setState((e as CustomEvent<Theme>).detail);
    window.addEventListener("pingo-theme", onChange);
    return () => window.removeEventListener("pingo-theme", onChange);
  }, []);
  return [theme, setTheme] as const;
}

// Compact segmented control used in the user menu.
export function ThemeToggle() {
  const [theme, set] = useTheme();
  return (
    <div role="radiogroup" aria-label="Tema" className="flex rounded-md bg-gray-soft p-0.5">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => set(value)}
          className={clsx(
            "flex h-7 flex-1 items-center justify-center rounded-[3px] transition-colors",
            theme === value ? "bg-surface text-fg shadow-card" : "text-fg-3 hover:text-fg",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}

// Larger cards used on the profile page.
export function ThemeCards() {
  const [theme, set] = useTheme();
  return (
    <div role="radiogroup" aria-label="Tema" className="grid grid-cols-3 gap-3">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          onClick={() => set(value)}
          className={clsx(
            "flex flex-col items-start gap-3 rounded-lg p-4 text-left ring-1 transition-[box-shadow,background]",
            theme === value ? "bg-accent-soft ring-2 ring-accent" : "ring-line hover:bg-gray-soft",
          )}
        >
          <Preview variant={value} />
          <span className="flex items-center gap-2 text-[13px] font-medium">
            <Icon className={clsx("size-3.5", theme === value ? "text-accent" : "text-fg-3")} />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

function Preview({ variant }: { variant: Theme }) {
  const half = (dark: boolean) => (
    <div className={clsx("flex h-full flex-1 gap-1 p-1.5", dark ? "bg-[#000]" : "bg-[#f5f5f7]")}>
      <div className={clsx("w-1/4 rounded-[2px]", dark ? "bg-[#1c1c1e]" : "bg-[#e8e8ed]")} />
      <div className={clsx("flex-1 space-y-1 rounded-[2px] p-1", dark ? "bg-[#161617]" : "bg-white")}>
        <div className="h-1 w-3/4 rounded-full bg-[#0071e3]" />
        <div className={clsx("h-1 w-1/2 rounded-full", dark ? "bg-[#3a3a3c]" : "bg-[#d2d2d7]")} />
      </div>
    </div>
  );
  return (
    <div className="flex h-14 w-full overflow-hidden rounded-[4px] ring-1 ring-line">
      {variant === "system" ? (
        <>
          {half(false)}
          {half(true)}
        </>
      ) : (
        half(variant === "dark")
      )}
    </div>
  );
}
