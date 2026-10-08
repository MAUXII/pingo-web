"use client";

import { useMemo, useState } from "react";
import { Check, Copy, ArrowRight } from "lucide-react";
import { Button, Card, CardHeader, ChannelTag, Field, Input, Mono, Textarea } from "@/components/ui";
import { DatePicker, Select } from "@/components/controls";
import { formatCents, formatDate, formatOffset } from "@/lib/format";
import type { Customer, DunningPolicy, MessageTemplate } from "@/lib/types";

function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + days));
  return dt.toISOString().slice(0, 10);
}

export function NewChargeForm({
  customers,
  policies,
  templates,
  today,
}: {
  customers: Customer[];
  policies: DunningPolicy[];
  templates: MessageTemplate[];
  today: string;
}) {
  const [customerId, setCustomerId] = useState(customers[0]!.id);
  const [amount, setAmount] = useState("289,00");
  const [dueDate, setDueDate] = useState("2026-10-10");
  const [description, setDescription] = useState("Mensalidade outubro · Pilates 3x");
  const [policyId, setPolicyId] = useState(policies.find((p) => p.isDefault)!.id);
  const [externalRef, setExternalRef] = useState("");
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  const cents = Math.round(Number(amount.replace(/\./g, "").replace(",", ".")) * 100) || 0;
  const policy = policies.find((p) => p.id === policyId)!;
  const customer = customers.find((c) => c.id === customerId)!;

  // Mirrors RF-16: steps whose time already passed are materialized as SKIPPED.
  const preview = useMemo(
    () =>
      policy.steps.map((s) => {
        const date = addDays(dueDate, s.offsetDays);
        const optOut = s.channel === "EMAIL" ? customer.emailOptOut || !customer.email : customer.smsOptOut || !customer.phone;
        return {
          ...s,
          date,
          template: templates.find((t) => t.id === s.templateId)?.name ?? "—",
          skipped: date < today,
          optOut,
        };
      }),
    [policy, dueDate, templates, today, customer],
  );

  const payLink = "https://pingo.app/pay/tk1043bXlfY2hhcmdl";

  if (created) {
    return (
      <Card className="mx-auto max-w-lg text-center !p-10">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-green-soft">
          <Check className="size-7 text-green" strokeWidth={2.4} />
        </div>
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Cobrança criada</h2>
        <p className="mt-2 text-[15px] text-fg-2">
          {formatCents(cents)} para {customer.name}, vencendo em {formatDate(dueDate)}. {preview.filter((p) => !p.skipped).length} lembretes
          foram agendados.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-surface-2 p-1.5 pl-4 text-left ring-1 ring-line">
          <Mono className="min-w-0 flex-1 truncate text-fg-2">{payLink}</Mono>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              navigator.clipboard?.writeText(payLink);
              setCopied(true);
            }}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copiado" : "Copiar link"}
          </Button>
        </div>
        <p className="mt-3 text-[12px] text-fg-3">O Pix só é gerado quando o cliente abrir o link, então o QR Code nunca chega vencido.</p>
        <div className="mt-8 flex justify-center gap-2">
          <Button variant="secondary" onClick={() => setCreated(false)}>
            Criar outra
          </Button>
          <Button variant="primary" href="/charges/ch_1042">
            Ver cobrança <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form
      className="grid gap-6 lg:grid-cols-5"
      onSubmit={(e) => {
        e.preventDefault();
        setCreated(true);
      }}
    >
      <Card className="lg:col-span-3">
        <CardHeader title="Detalhes" />
        <div className="space-y-5">
          <Field label="Cliente">
            <Select value={customerId} onValueChange={setCustomerId} options={customers.map((c) => ({ value: c.id, label: c.name, hint: c.email ?? c.phone ?? undefined }))} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Valor">
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[14px] text-fg-2">R$</span>
                <Input className="tabular pl-10" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </Field>
            <Field label="Vencimento" hint="Fuso de São Paulo">
              <DatePicker value={dueDate} onChange={setDueDate} />
            </Field>
          </div>
          <Field label="Descrição" hint="Aparece para o cliente na página de pagamento.">
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Régua">
              <Select
                value={policyId}
                onValueChange={setPolicyId}
                options={policies.map((p) => ({ value: p.id, label: p.isDefault ? `${p.name} (padrão)` : p.name, hint: `${p.steps.length} passos` }))}
              />
            </Field>
            <Field label="Referência externa" hint="Opcional, única por empresa.">
              <Input placeholder="AUR-2026-10-019" value={externalRef} onChange={(e) => setExternalRef(e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <div className="text-[13px] text-fg-2">Total</div>
          <div className="tabular mt-1 text-[34px] font-semibold tracking-[-0.03em]">{formatCents(cents)}</div>
          <div className="mt-1 text-[13px] text-fg-2">via Pix · vence {formatDate(dueDate)}</div>
        </Card>

        <Card>
          <CardHeader title="Lembretes" subtitle={`Snapshot da régua “${policy.name}”`} />
          <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line-strong">
            {preview.map((p) => (
              <li key={p.id} className="relative flex gap-4 pl-6">
                <span
                  className={`absolute top-1.5 left-0 size-[11px] rounded-full ring-4 ring-surface ${
                    p.skipped || p.optOut ? "bg-fg-3/40" : p.offsetDays > 0 ? "bg-red" : p.offsetDays === 0 ? "bg-amber" : "bg-accent"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`text-[14px] font-medium ${p.skipped || p.optOut ? "text-fg-3 line-through" : ""}`}>
                      {formatOffset(p.offsetDays)}
                    </span>
                    <span className="tabular text-[12px] text-fg-3">{formatDate(p.date)}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[13px] text-fg-2">
                    <ChannelTag channel={p.channel} /> · {p.template}
                  </div>
                  {p.skipped && <div className="mt-1 text-[12px] text-fg-3">Já passou, fica como SKIPPED</div>}
                  {!p.skipped && p.optOut && <div className="mt-1 text-[12px] text-amber">Cliente sem contato ou com opt-out neste canal</div>}
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" href="/charges" type="button">
            Cancelar
          </Button>
          <Button variant="primary" size="lg" type="submit">
            Criar cobrança
          </Button>
        </div>
      </div>
    </form>
  );
}
