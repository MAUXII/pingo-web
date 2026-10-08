import clsx from "clsx";
import { Mail, MessageSquareText } from "lucide-react";
import type { DunningStep } from "@/lib/types";

// Horizontal ruler of steps around the due date. Range adapts to the steps.
export function PolicyTimeline({ steps, compact = false }: { steps: Pick<DunningStep, "id" | "offsetDays" | "channel">[]; compact?: boolean }) {
  const min = Math.min(-3, ...steps.map((s) => s.offsetDays)) - 1;
  const max = Math.max(3, ...steps.map((s) => s.offsetDays)) + 1;
  const pos = (d: number) => ((d - min) / (max - min)) * 100;

  return (
    <div className={clsx("relative", compact ? "h-12" : "h-20")}>
      <div className="absolute top-1/2 right-0 left-0 h-px bg-line-strong" />
      <div className="absolute top-1/2 h-px bg-red/40" style={{ left: `${pos(0)}%`, right: 0 }} />
      <div className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${pos(0)}%` }}>
        <span className="h-7 w-0.5 rounded-full bg-fg/70" />
        {!compact && <span className="absolute top-7 text-[11px] font-medium whitespace-nowrap">Vencimento</span>}
      </div>
      {steps.map((s) => {
        const Icon = s.channel === "EMAIL" ? Mail : MessageSquareText;
        return (
          <div
            key={s.id}
            className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${pos(s.offsetDays)}%` }}
          >
            <span className="rounded-full bg-surface">
            <span
              className={clsx(
                "flex items-center justify-center rounded-full ring-4 ring-surface",
                compact ? "size-6" : "size-8",
                s.offsetDays < 0 ? "bg-accent-soft text-accent" : s.offsetDays === 0 ? "bg-amber-soft text-amber" : "bg-red-soft text-red",
              )}
            >
              <Icon className={compact ? "size-3" : "size-3.5"} strokeWidth={2} />
            </span>
            </span>
            {!compact && (
              <span className="tabular absolute -top-6 font-mono text-[11px] whitespace-nowrap text-fg-2">
                {s.offsetDays > 0 ? `D+${s.offsetDays}` : s.offsetDays < 0 ? `D${s.offsetDays}` : "D0"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
