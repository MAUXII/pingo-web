"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutGrid, Receipt, Users, Route, FileText, Settings, Search, ChevronsUpDown } from "lucide-react";
import { Avatar, Kbd, Logo } from "./ui";

const nav = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutGrid },
  { href: "/charges", label: "Cobranças", icon: Receipt },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/dunning", label: "Réguas", icon: Route },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ tenantName, userName, role }: { tenantName: string; userName: string; role: string }) {
  const path = usePathname();
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col bg-[var(--sidebar)] lg:flex">
        <div className="px-5 pt-6 pb-5">
          <Logo />
        </div>

        <button className="mx-3 mb-4 flex h-9 items-center gap-2 rounded-md bg-gray-soft px-3 text-[13px] text-fg-3">
          <Search className="size-3.5" strokeWidth={2} />
          Buscar
          <span className="ml-auto flex gap-0.5">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <nav className="flex flex-col gap-0.5 px-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex h-9 items-center gap-3 rounded-md px-3 text-[14px] transition-colors",
                  active ? "bg-accent-soft font-medium text-accent" : "text-fg-2 hover:bg-gray-soft hover:text-fg",
                )}
              >
                <Icon className="size-[17px]" strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-3">
          <div className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] text-fg-2">
            <span className="size-1.5 rounded-full bg-amber" />
            Stripe em modo de teste
          </div>
          <button className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-gray-soft">
            <Avatar name={userName} size={32} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{tenantName}</span>
              <span className="block truncate text-[12px] text-fg-2">
                {userName} · {role === "ADMIN" ? "Admin" : "Operador"}
              </span>
            </span>
            <ChevronsUpDown className="size-4 text-fg-3" />
          </button>
        </div>
      </aside>

      <div className="sticky top-0 z-20 bg-[var(--sidebar)] lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo size={24} />
          <Avatar name={userName} size={28} />
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {nav.map(({ href, label }) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "shrink-0 rounded-md px-3 py-1.5 text-[13px]",
                  active ? "bg-accent-soft font-medium text-accent" : "text-fg-2",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
