"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { ChannelTag, DeliveryBadge } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import type { Notification } from "@/lib/types";

export function NotificationList({ items }: { items: Notification[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  if (items.length === 0) {
    return <p className="px-6 pb-6 text-[14px] text-fg-2">Nenhuma notificação enviada ainda.</p>;
  }
  return (
    <ul className="divide-y divide-line border-t border-line">
      {items.map((n) => {
        const isOpen = open === n.id;
        return (
          <li key={n.id}>
            <button
              className="flex w-full items-center gap-4 px-6 py-3.5 text-left hover:bg-surface-2"
              onClick={() => setOpen(isOpen ? null : n.id)}
              aria-expanded={isOpen}
            >
              <ChevronRight className={clsx("size-4 shrink-0 text-fg-3 transition-transform", isOpen && "rotate-90")} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium">{n.renderedSubject ?? n.renderedBody.slice(0, 60)}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[13px] text-fg-2">
                  <ChannelTag channel={n.channel} /> · {n.recipient}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <DeliveryBadge status={n.status} />
                <span className="text-[12px] text-fg-3">{n.sentAt ? formatDateTime(n.sentAt) : "—"}</span>
              </div>
            </button>
            {isOpen && (
              <div className="px-6 pb-5 pl-14">
                <div className="rounded-xl bg-surface-2 p-4 ring-1 ring-line">
                  {n.renderedSubject && (
                    <div className="mb-3 border-b border-line pb-3 text-[13px]">
                      <span className="text-fg-3">Assunto </span>
                      {n.renderedSubject}
                    </div>
                  )}
                  <p className="text-[14px] leading-relaxed whitespace-pre-line">{n.renderedBody}</p>
                </div>
                <div className="mt-2 font-mono text-[11.5px] text-fg-3">
                  ↳ {n.attempts} {n.attempts === 1 ? "tentativa" : "tentativas"} · reminder {n.reminderId}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
