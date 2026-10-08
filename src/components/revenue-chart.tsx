"use client";

import { useState } from "react";
import { formatCents, formatShortDate } from "@/lib/format";

type Point = { date: string; billedCents: number; receivedCents: number };

// Series colors validated with the dataviz palette checker (light surface).
const BILLED = "var(--chart-1)";
const RECEIVED = "var(--chart-2)";

export function RevenueChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 220;
  const pad = { t: 12, r: 8, b: 26, l: 8 };
  const max = Math.max(...data.map((d) => d.billedCents)) * 1.1;
  const x = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);

  const line = (key: "billedCents" | "receivedCents") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");
  const area = `${line("receivedCents")} L${x(data.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => pad.t + (1 - f) * (H - pad.t - pad.b));
  const h = hover !== null ? data[hover]! : null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-5 text-[12px] text-fg-2">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-3.5 rounded-full" style={{ background: BILLED }} />
          Cobrado
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-3.5 rounded-full" style={{ background: RECEIVED }} />
          Recebido
        </span>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Cobrado e recebido por dia nos últimos 30 dias"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * W;
            const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
            setHover(Math.max(0, Math.min(data.length - 1, i)));
          }}
        >
          <defs>
            <linearGradient id="recv" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {grid.map((gy) => (
            <line key={gy} x1={pad.l} x2={W - pad.r} y1={gy} y2={gy} stroke="var(--line)" />
          ))}
          <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--line-strong)" />
          <path d={area} fill="url(#recv)" />
          <path d={line("billedCents")} fill="none" stroke={BILLED} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={line("receivedCents")} fill="none" stroke={RECEIVED} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {[0, 7, 14, 21, 29].map((i) => (
            <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === 29 ? "end" : "middle"} fontSize="11" fill="var(--fg-3)">
              {formatShortDate(data[i]!.date)}
            </text>
          ))}
          {hover !== null && h && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="var(--line-strong)" />
              <circle cx={x(hover)} cy={y(h.billedCents)} r="4.5" fill={BILLED} stroke="var(--surface)" strokeWidth="2" />
              <circle cx={x(hover)} cy={y(h.receivedCents)} r="4.5" fill={RECEIVED} stroke="var(--surface)" strokeWidth="2" />
            </g>
          )}
        </svg>
        {hover !== null && h && (
          <div
            className="pointer-events-none absolute top-0 rounded-xl bg-surface px-3 py-2 text-[12px] shadow-pop ring-1 ring-line"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > data.length / 2 ? "-110%" : "10%"})` }}
          >
            <div className="mb-1 font-medium">{formatShortDate(h.date)}</div>
            <div className="tabular flex justify-between gap-4 text-fg-2">
              Cobrado <span className="text-fg">{formatCents(h.billedCents)}</span>
            </div>
            <div className="tabular flex justify-between gap-4 text-fg-2">
              Recebido <span className="text-fg">{formatCents(h.receivedCents)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
