"use client";

// Interactive form controls built on Radix primitives (the same base used by
// shadcn-style kits such as Ruixen UI), styled with the PinGo tokens.
import * as RSelect from "@radix-ui/react-select";
import * as RSwitch from "@radix-ui/react-switch";
import * as RPopover from "@radix-ui/react-popover";
import * as RDialog from "@radix-ui/react-dialog";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import clsx from "clsx";
import { Calendar, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const triggerCls =
  "inline-flex h-10 w-full items-center justify-between gap-2 rounded-xl bg-surface px-3.5 text-left text-[14px] text-fg shadow-[inset_0_0_0_1px_var(--line-strong)] outline-none transition-shadow data-[placeholder]:text-fg-3 focus-visible:shadow-[inset_0_0_0_1px_var(--accent),0_0_0_4px_var(--accent-soft)] data-[state=open]:shadow-[inset_0_0_0_1px_var(--accent),0_0_0_4px_var(--accent-soft)]";

const popCls =
  "z-50 overflow-hidden rounded-xl bg-surface p-1 shadow-pop ring-1 ring-line data-[state=open]:animate-[pop-in_120ms_ease-out]";

export type Option = { value: string; label: string; hint?: string; disabled?: boolean };

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecionar",
  className,
  name,
}: {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
}) {
  return (
    <RSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} name={name}>
      <RSelect.Trigger className={clsx(triggerCls, className)}>
        <span className="min-w-0 truncate">
          <RSelect.Value placeholder={placeholder} />
        </span>
        <RSelect.Icon>
          <ChevronDown className="size-4 shrink-0 text-fg-2" />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={6}
          className={clsx(popCls, "max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] min-w-[180px]")}
        >
          <RSelect.Viewport>
            {options.map((o) => (
              <RSelect.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className="relative flex cursor-default items-center gap-2 rounded-md py-2 pr-8 pl-3 text-[14px] outline-none select-none data-[disabled]:text-fg-3 data-[highlighted]:bg-gray-soft"
              >
                <span className="min-w-0 flex-1">
                  <RSelect.ItemText>{o.label}</RSelect.ItemText>
                  {o.hint && <span className="block text-[12px] text-fg-3">{o.hint}</span>}
                </span>
                <RSelect.ItemIndicator className="absolute right-2.5">
                  <Check className="size-4 text-accent" strokeWidth={2.4} />
                </RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  description,
  disabled,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}) {
  const control = (
    <RSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className="relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer rounded-full bg-line-strong transition-colors outline-none focus-visible:ring-4 focus-visible:ring-accent-soft disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-green"
    >
      <RSwitch.Thumb className="block size-[18px] translate-x-[2px] translate-y-[2px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform data-[state=checked]:translate-x-[18px]" />
    </RSwitch.Root>
  );
  if (!label) return control;
  return (
    <label className="flex w-full cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block text-[14px]">{label}</span>
        {description && <span className="block text-[13px] text-fg-2">{description}</span>}
      </span>
      {control}
    </label>
  );
}

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

export function DatePicker({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = fromIso(value);
  return (
    <RPopover.Root open={open} onOpenChange={setOpen}>
      <RPopover.Trigger className={triggerCls}>
        <span>{selected.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
        <Calendar className="size-4 shrink-0 text-fg-2" />
      </RPopover.Trigger>
      <RPopover.Portal>
        <RPopover.Content sideOffset={6} align="start" className={clsx(popCls, "p-3")}>
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={selected}
            defaultMonth={selected}
            onSelect={(d) => {
              if (d) {
                onChange(toIso(d));
                setOpen(false);
              }
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />,
            }}
            classNames={{
              root: "relative text-[13px]",
              months: "flex",
              month: "space-y-2",
              month_caption: "flex h-8 items-center px-1.5 font-medium capitalize",
              nav: "absolute top-0 right-0 flex gap-1",
              button_previous: "flex size-8 items-center justify-center rounded-md text-fg-2 hover:bg-gray-soft",
              button_next: "flex size-8 items-center justify-center rounded-md text-fg-2 hover:bg-gray-soft",
              month_grid: "border-collapse",
              weekdays: "flex",
              weekday: "w-9 text-[11px] font-normal text-fg-3 capitalize",
              week: "flex",
              day: "size-9 p-0 text-center",
              day_button:
                "size-9 rounded-md tabular-nums hover:bg-gray-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              selected: "[&>button]:bg-accent [&>button]:text-white [&>button]:hover:bg-accent",
              today: "font-semibold text-accent",
              outside: "text-fg-3",
              disabled: "text-fg-3 opacity-50",
            }}
          />
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}

export function Dialog({
  open,
  onClose,
  children,
  width = 420,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  title?: string;
}) {
  return (
    <RDialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <RDialog.Portal>
        <RDialog.Overlay className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px]" />
        <RDialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface p-7 shadow-pop ring-1 ring-line outline-none"
          style={{ maxWidth: width }}
        >
          <RDialog.Title className="sr-only">{title ?? "Diálogo"}</RDialog.Title>
          {children}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
