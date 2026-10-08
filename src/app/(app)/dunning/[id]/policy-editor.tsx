"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, Info } from "lucide-react";
import { Button, Card, CardHeader, Field, Input } from "@/components/ui";
import { Select, Switch } from "@/components/controls";
import { PolicyTimeline } from "@/components/policy-timeline";
import { formatOffset } from "@/lib/format";
import type { Channel, DunningPolicy, DunningStep, MessageTemplate } from "@/lib/types";

export function PolicyEditor({ policy, templates }: { policy: DunningPolicy; templates: MessageTemplate[] }) {
  const [name, setName] = useState(policy.name);
  const [isDefault, setIsDefault] = useState(policy.isDefault);
  const [steps, setSteps] = useState<DunningStep[]>(policy.steps);

  const update = (id: string, patch: Partial<DunningStep>) => setSteps((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const sorted = [...steps].sort((a, b) => a.offsetDays - b.offsetDays);

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field label="Nome">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <div className="flex h-10 items-center gap-2.5">
            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            <span className="text-[14px]">Régua padrão</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Linha do tempo" subtitle="Horários respeitam a janela de envio (08h–20h)" />
        <div className="px-4 pt-6 pb-4">
          <PolicyTimeline steps={sorted} />
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-6 pb-0">
          <CardHeader
            title="Passos"
            action={
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  setSteps((s) => [
                    ...s,
                    { id: `new_${Date.now()}`, offsetDays: (sorted.at(-1)?.offsetDays ?? 0) + 3, channel: "EMAIL", templateId: templates[0]!.id },
                  ])
                }
              >
                <Plus className="size-3.5" /> Adicionar passo
              </Button>
            }
          />
        </div>
        <ul className="divide-y divide-line border-t border-line">
          {sorted.map((s, i) => {
            const options = templates.filter((t) => t.channel === s.channel);
            return (
              <li key={s.id} className="grid items-center gap-4 px-6 py-4 md:grid-cols-[28px_200px_140px_1fr_36px]">
                <span className="flex size-7 items-center justify-center rounded-full bg-gray-soft font-mono text-[12px] text-fg-2">{i + 1}</span>
                <div className="flex items-center gap-2">
                  <Stepper onClick={() => update(s.id, { offsetDays: s.offsetDays - 1 })} icon={<Minus className="size-3.5" />} />
                  <span className="tabular flex-1 text-center text-[14px] font-medium">{formatOffset(s.offsetDays)}</span>
                  <Stepper onClick={() => update(s.id, { offsetDays: s.offsetDays + 1 })} icon={<Plus className="size-3.5" />} />
                </div>
                <Select
                  value={s.channel}
                  onValueChange={(v) => {
                    const channel = v as Channel;
                    // Step and template must share a channel (composite FK in the schema).
                    update(s.id, { channel, templateId: templates.find((t) => t.channel === channel)!.id });
                  }}
                  options={[
                    { value: "EMAIL", label: "E-mail" },
                    { value: "SMS", label: "SMS" },
                  ]}
                />
                <Select
                  value={s.templateId}
                  onValueChange={(v) => update(s.id, { templateId: v })}
                  options={options.map((t) => ({ value: t.id, label: t.name }))}
                />
                <button
                  className="flex size-9 items-center justify-center rounded-md text-fg-3 hover:bg-red-soft hover:text-red"
                  onClick={() => setSteps((x) => x.filter((y) => y.id !== s.id))}
                  aria-label="Remover passo"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[13px] text-fg-2">
          <Info className="size-4 shrink-0" /> As mudanças valem só para cobranças criadas a partir de agora.
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" href="/dunning">
            Cancelar
          </Button>
          <Button variant="primary">Salvar régua</Button>
        </div>
      </div>
    </div>
  );
}

function Stepper({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-md text-fg-2 shadow-[inset_0_0_0_1px_var(--line-strong)] hover:bg-gray-soft"
    >
      {icon}
    </button>
  );
}
