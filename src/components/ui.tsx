import Link from "next/link";
import clsx from "clsx";
import type { ChargeStatus, NotificationStatus, ReminderStatus, Channel } from "@/lib/types";
import { Mail, MessageSquareText } from "lucide-react";

export function Logo({ size = 28, withName = true }: { size?: number; withName?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="6" fill="var(--accent)" />
        <path
          d="M16 7.5c-3.9 0-7 3.05-7 6.83 0 4.9 5.6 9.7 6.4 10.36.35.29.85.29 1.2 0 .8-.66 6.4-5.46 6.4-10.36 0-3.78-3.1-6.83-7-6.83Z"
          fill="#fff"
        />
        <circle cx="16" cy="14.3" r="2.6" fill="var(--accent)" />
      </svg>
      {withName && <span className="text-[17px] font-semibold tracking-[-0.02em]">PinGo</span>}
    </span>
  );
}

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({ variant = "secondary", size = "md", href, className, children, ...rest }: ButtonProps) {
  const cls = clsx(
    "inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-[background,box-shadow,transform,opacity] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft",
    size === "sm" && "h-8 px-3.5 text-[13px]",
    size === "md" && "h-9 px-4 text-[14px]",
    size === "lg" && "h-11 px-6 text-[15px]",
    variant === "primary" && "bg-fg text-bg hover:opacity-85",
    variant === "secondary" && "bg-surface text-fg shadow-[inset_0_0_0_1px_var(--line-strong)] hover:bg-surface-2",
    variant === "ghost" && "text-fg-2 hover:text-fg hover:bg-gray-soft",
    variant === "danger" && "bg-red-soft text-red hover:bg-red/15",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export function Card({ className, children, padded = true }: { className?: string; children: React.ReactNode; padded?: boolean }) {
  return (
    <div className={clsx("rounded-2xl bg-surface shadow-card ring-1 ring-line", padded && "p-6", className)}>{children}</div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-fg-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="mb-2 text-[13px] text-fg-2">{eyebrow}</div>}
        <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em]">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-fg-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

const chargeStatus: Record<ChargeStatus, { label: string; cls: string; dot: string }> = {
  PENDING: { label: "Pendente", cls: "bg-amber-soft text-amber", dot: "bg-amber" },
  OVERDUE: { label: "Em atraso", cls: "bg-red-soft text-red", dot: "bg-red" },
  PAID: { label: "Pago", cls: "bg-green-soft text-green", dot: "bg-green" },
  CANCELED: { label: "Cancelada", cls: "bg-gray-soft text-fg-2", dot: "bg-fg-3" },
};

export function StatusBadge({ status }: { status: ChargeStatus }) {
  const s = chargeStatus[status];
  return (
    <span className={clsx("inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium", s.cls)}>
      <span className={clsx("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export const chargeStatusLabel = (s: ChargeStatus) => chargeStatus[s].label;

const deliveryStatus: Record<NotificationStatus | ReminderStatus, { label: string; cls: string }> = {
  SCHEDULED: { label: "Agendado", cls: "text-fg-2 bg-gray-soft" },
  PENDING: { label: "Na fila", cls: "text-fg-2 bg-gray-soft" },
  SENT: { label: "Enviado", cls: "text-green bg-green-soft" },
  FAILED: { label: "Falhou · retry", cls: "text-amber bg-amber-soft" },
  DEAD: { label: "DLQ", cls: "text-red bg-red-soft" },
  SKIPPED: { label: "Ignorado", cls: "text-fg-2 bg-gray-soft" },
  CANCELED: { label: "Cancelado", cls: "text-fg-3 bg-gray-soft" },
};

export function DeliveryBadge({ status }: { status: NotificationStatus | ReminderStatus }) {
  const s = deliveryStatus[status];
  return <span className={clsx("inline-flex h-5 items-center rounded-md px-1.5 text-[11px] font-medium", s.cls)}>{s.label}</span>;
}

export function ChannelTag({ channel }: { channel: Channel }) {
  const Icon = channel === "EMAIL" ? Mail : MessageSquareText;
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-fg-2">
      <Icon className="size-3.5" strokeWidth={1.8} />
      {channel === "EMAIL" ? "E-mail" : "SMS"}
    </span>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-fg">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-fg-2">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "h-10 w-full rounded-xl bg-surface px-3.5 text-[14px] text-fg placeholder:text-fg-3 shadow-[inset_0_0_0_1px_var(--line-strong)] outline-none transition-shadow focus:shadow-[inset_0_0_0_1px_var(--accent),0_0_0_4px_var(--accent-soft)]";

export function Input(props: React.ComponentProps<"input">) {
  return <input {...props} className={clsx(inputCls, props.className)} />;
}

export function Textarea(props: React.ComponentProps<"textarea">) {
  return <textarea {...props} className={clsx(inputCls, "h-auto py-3 leading-relaxed", props.className)} />;
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
      style={{ width: size, height: size, background: `hsl(${hue} 60% 92%)`, color: `hsl(${hue} 45% 35%)`, fontSize: size * 0.38 }}
    >
      {name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")}
    </span>
  );
}

export function Mono({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={clsx("font-mono text-[12.5px] tracking-normal", className)}>{children}</span>;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-gray-soft px-1.5 font-mono text-[11px] text-fg-2">
      {children}
    </kbd>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px]">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={clsx("border-b border-line px-5 py-3 text-[12px] font-medium tracking-normal text-fg-2", className)}>{children}</th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={clsx("border-b border-line px-5 py-3.5 align-middle", className)}>{children}</td>;
}

export function DescList({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="divide-y divide-line">
      {items.map((i) => (
        <div key={i.label} className="flex items-center justify-between gap-6 py-3 text-[14px] first:pt-0 last:pb-0">
          <dt className="text-fg-2">{i.label}</dt>
          <dd className="text-right">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
