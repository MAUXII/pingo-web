"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Button, Card, CardHeader, Field, Input, Textarea } from "@/components/ui";
import type { Channel, MessageTemplate } from "@/lib/types";

const variables = [
  { key: "customer_name", label: "Nome", sample: "Rafael" },
  { key: "amount", label: "Valor", sample: "R$ 189,00" },
  { key: "due_date", label: "Vencimento", sample: "05 out" },
  { key: "pay_link", label: "Link de pagamento", sample: "pingo.app/pay/tk1041Qm9v" },
  { key: "tenant_name", label: "Empresa", sample: "Studio Aurora" },
];

const known = new Set(variables.map((v) => v.key));

// RN-19: the API rejects any {{var}} outside the five above with 422.
function unknownVars(text: string) {
  return [...new Set([...text.matchAll(/\{\{\s*([^}]*?)\s*\}\}/g)].map((m) => m[1]!))].filter((k) => !known.has(k));
}

function render(text: string) {
  return variables.reduce((acc, v) => acc.replaceAll(`{{${v.key}}}`, v.sample), text);
}

export function TemplateEditor({ template }: { template: MessageTemplate }) {
  const [name, setName] = useState(template.name);
  const [channel, setChannel] = useState<Channel>(template.channel);
  const [subject, setSubject] = useState(template.subject ?? "");
  const [body, setBody] = useState(template.body);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const insert = (key: string) => {
    const el = bodyRef.current;
    const token = `{{${key}}}`;
    if (!el) return setBody((b) => b + token);
    const start = el.selectionStart;
    setBody(body.slice(0, start) + token + body.slice(el.selectionEnd));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const invalid = unknownVars(`${channel === "EMAIL" ? subject : ""} ${body}`);
  const rendered = render(body);
  const smsLen = rendered.length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader title="Conteúdo" />
        <div className="space-y-5">
          <Field label="Nome interno">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Canal">
            <div className="inline-flex rounded-lg bg-gray-soft p-1">
              {(["EMAIL", "SMS"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={clsx(
                    "h-8 rounded-md px-4 text-[13px]",
                    channel === c ? "bg-surface font-medium shadow-card" : "text-fg-2",
                  )}
                >
                  {c === "EMAIL" ? "E-mail" : "SMS"}
                </button>
              ))}
            </div>
          </Field>
          {channel === "EMAIL" && (
            <Field label="Assunto">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
          )}
          <Field label="Mensagem">
            <Textarea
              ref={bodyRef}
              rows={8}
              className={clsx("font-mono text-[13px]", invalid.length > 0 && "ring-red/60 focus:ring-red/60")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Field>
          {invalid.length > 0 && (
            <p className="-mt-2 text-[13px] text-red">
              Variável desconhecida: {invalid.map((k) => <code key={k} className="mr-1 font-mono">{`{{${k}}}`}</code>)}
              Use só as cinco abaixo.
            </p>
          )}
          <div>
            <div className="mb-2 text-[12px] text-fg-2">Inserir variável</div>
            <div className="flex flex-wrap gap-1.5">
              {variables.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => insert(v.key)}
                  className="rounded-lg bg-accent-soft px-2 py-1 font-mono text-[12px] text-accent hover:bg-accent/15"
                >
                  {`{{${v.key}}}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="lg:sticky lg:top-8">
          <CardHeader title="Pré-visualização" subtitle="Com dados de exemplo" />
          {channel === "EMAIL" ? (
            <div className="overflow-hidden rounded-2xl ring-1 ring-line">
              <div className="space-y-1 border-b border-line bg-surface-2 px-5 py-4 text-[13px]">
                <div>
                  <span className="text-fg-3">De </span>Studio Aurora
                </div>
                <div>
                  <span className="text-fg-3">Para </span>rafa.moura@outlook.com
                </div>
                <div className="pt-1 text-[15px] font-semibold">{render(subject)}</div>
              </div>
              <div className="px-5 py-5 text-[14px] leading-relaxed whitespace-pre-line">{rendered}</div>
              <div className="border-t border-line px-5 py-3 text-[11px] text-fg-3">
                Não quer mais receber estes lembretes? <span className="underline">Descadastrar</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface-2 p-5 ring-1 ring-line">
              <div className="mb-3 text-center text-[11px] text-fg-3">Hoje 09:12</div>
              <div className="max-w-[85%] rounded-[20px] rounded-bl-md bg-gray-soft px-4 py-2.5 text-[14px] leading-snug">{rendered}</div>
              <div className={clsx("mt-3 text-right font-mono text-[11px]", smsLen > 160 ? "text-amber" : "text-fg-3")}>
                {smsLen}/160 · {Math.ceil(smsLen / 160)} {Math.ceil(smsLen / 160) === 1 ? "segmento" : "segmentos"}
              </div>
            </div>
          )}
        </Card>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" href="/templates">
            Cancelar
          </Button>
          <Button variant="primary" disabled={invalid.length > 0}>
            Salvar template
          </Button>
        </div>
      </div>
    </div>
  );
}
