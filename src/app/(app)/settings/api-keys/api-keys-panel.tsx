"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Copy, KeyRound, Plus, TriangleAlert } from "lucide-react";
import { Button, Card, CardHeader, Field, Input, Mono } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { formatDate, formatDateTime } from "@/lib/format";
import type { ApiKey } from "@/lib/types";

const NEW_KEY = "pg_live_Z3kP9wq2Lm8VtR4xYb7Nc1Hd6Fj0Qs5A";

export function ApiKeysPanel({ keys }: { keys: ApiKey[] }) {
  const [step, setStep] = useState<null | "name" | "reveal">(null);
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Card padded={false}>
        <div className="p-6 pb-0">
          <CardHeader
            title="API keys"
            subtitle="Para o seu sistema criar cobranças. Guardamos só um hash; a chave aparece uma única vez."
            action={
              <Button size="sm" variant="secondary" onClick={() => setStep("name")}>
                <Plus className="size-3.5" /> Nova chave
              </Button>
            }
          />
        </div>
        <ul className="divide-y divide-line border-t border-line">
          {keys.map((k) => (
            <li key={k.id} className={clsx("flex items-center gap-4 px-6 py-4", k.revokedAt && "opacity-50")}>
              <span className="flex size-9 items-center justify-center rounded-xl bg-gray-soft">
                <KeyRound className="size-4 text-fg-2" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium">{k.name}</div>
                <Mono className="text-fg-2">{k.prefix}••••••••</Mono>
              </div>
              <div className="hidden text-right text-[12px] text-fg-3 sm:block">
                <div>Criada {formatDate(k.createdAt)}</div>
                <div>{k.lastUsedAt ? `Usada ${formatDateTime(k.lastUsedAt)}` : "Nunca usada"}</div>
              </div>
              {k.revokedAt ? (
                <span className="text-[12px] text-fg-3">Revogada</span>
              ) : (
                <Button size="sm" variant="ghost" className="text-red hover:bg-red-soft hover:text-red">
                  Revogar
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Exemplo" subtitle="Crie uma cobrança com idempotência" />
        <pre className="no-scrollbar overflow-x-auto rounded-xl bg-[#1d1d1f] p-5 font-mono text-[12.5px] leading-relaxed text-[#e5e5ea]">
          <span className="text-[#8e8e93]">$</span> curl https://api.pingo.app/api/v1/charges \{"\n"}
          {"    "}-H <span className="text-[#7cc0ff]">&quot;X-API-Key: pg_live_…&quot;</span> \{"\n"}
          {"    "}-H <span className="text-[#7cc0ff]">&quot;Idempotency-Key: AUR-2026-10-019&quot;</span> \{"\n"}
          {"    "}-d <span className="text-[#7cc0ff]">{`'{"customerId":"cu_01","amountCents":28900,"dueDate":"2026-10-10"}'`}</span>
        </pre>
      </Card>

      <Dialog open={step === "name"} onClose={() => setStep(null)}>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Nova API key</h3>
        <p className="mt-1 mb-5 text-[14px] text-fg-2">Dê um nome que lembre onde ela será usada.</p>
        <Field label="Nome">
          <Input autoFocus placeholder="erp-integracao" />
        </Field>
        <div className="mt-7 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setStep(null)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => setStep("reveal")}>
            Criar chave
          </Button>
        </div>
      </Dialog>

      <Dialog open={step === "reveal"} onClose={() => setStep(null)} width={480}>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Copie sua chave agora</h3>
        <p className="mt-2 flex gap-2 rounded-xl bg-amber-soft px-4 py-3 text-[13px] text-amber">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          Por segurança, esta é a única vez que a chave completa aparece.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 p-1.5 pl-4 ring-1 ring-line">
          <Mono className="min-w-0 flex-1 truncate">{NEW_KEY}</Mono>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              navigator.clipboard?.writeText(NEW_KEY);
              setCopied(true);
            }}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copiada" : "Copiar"}
          </Button>
        </div>
        <div className="mt-7 flex justify-end">
          <Button variant="primary" onClick={() => setStep(null)}>
            Pronto
          </Button>
        </div>
      </Dialog>
    </>
  );
}
