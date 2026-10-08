"use client";

import { useState } from "react";
import Link from "next/link";
import * as RPopover from "@radix-ui/react-popover";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { popCls } from "./controls";
import { ThemeToggle } from "./theme-picker";
import { Avatar } from "./ui";

type Props = { tenantName: string; userName: string; userEmail: string; role: string; compact?: boolean };

export function UserMenu({ tenantName, userName, userEmail, role, compact }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <RPopover.Root open={open} onOpenChange={setOpen}>
      <RPopover.Trigger asChild>
        {compact ? (
          <button aria-label="Menu da conta" className="rounded-full">
            <Avatar name={userName} size={28} />
          </button>
        ) : (
          <button className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-gray-soft data-[state=open]:bg-gray-soft">
            <Avatar name={userName} size={32} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{tenantName}</span>
              <span className="block truncate text-[12px] text-fg-2">
                {userName} · {role === "ADMIN" ? "Admin" : "Operador"}
              </span>
            </span>
            <ChevronsUpDown className="size-4 text-fg-3" />
          </button>
        )}
      </RPopover.Trigger>
      <RPopover.Portal>
        <RPopover.Content
          side={compact ? "bottom" : "top"}
          align={compact ? "end" : "start"}
          sideOffset={8}
          className={`${popCls} w-[232px]`}
        >
          <div className="px-2.5 pt-2 pb-2.5">
            <div className="truncate text-[13px] font-medium">{userName}</div>
            <div className="truncate text-[12px] text-fg-2">{userEmail}</div>
          </div>
          <div className="mx-1 h-px bg-line" />
          <div className="py-1">
            <Link href="/profile" onClick={close} className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] hover:bg-gray-soft">
              <UserRound className="size-4 text-fg-3" />
              Meu perfil
            </Link>
          </div>
          <div className="flex items-center justify-between gap-3 px-2.5 py-1.5">
            <span className="text-[13px]">Tema</span>
            <div className="w-[108px]">
              <ThemeToggle />
            </div>
          </div>
          <div className="mx-1 my-1 h-px bg-line" />
          <Link href="/login" onClick={close} className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] text-red hover:bg-red-soft">
            <LogOut className="size-4" />
            Sair
          </Link>
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}
