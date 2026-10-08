"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { href: "/settings", label: "Geral" },
  { href: "/settings/team", label: "Equipe" },
  { href: "/settings/api-keys", label: "API keys" },
  { href: "/settings/payments", label: "Pagamentos" },
  { href: "/settings/audit", label: "Auditoria" },
];

export function SettingsNav() {
  const path = usePathname();
  return (
    <nav className="no-scrollbar mb-8 flex gap-6 overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--line)]">
      {tabs.map((t) => {
        const active = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={clsx(
              "shrink-0 pb-3 text-[14px] transition-colors",
              active ? "font-medium text-fg shadow-[inset_0_-2px_0_var(--fg)]" : "text-fg-2 hover:text-fg",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
