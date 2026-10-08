import { Button, Card, CardHeader, DescList, Field, Input, Mono } from "@/components/ui";
import { Select } from "@/components/controls";
import { getPspAccount } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Pagamentos" };

export default function PaymentsSettingsPage() {
  const psp = getPspAccount();
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#635bff] text-[20px] font-bold text-white">S</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em]">Stripe</h2>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-soft px-2.5 py-0.5 text-[12px] font-medium text-amber">
                <span className="size-1.5 rounded-full bg-amber" /> Sandbox
              </span>
            </div>
            <p className="mt-1 text-[13px] text-fg-2">
              Conectado. Último evento recebido {psp.lastEventAt ? formatDateTime(psp.lastEventAt) : "nunca"}.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Credenciais" subtitle="Guardamos só a referência. O segredo fica no cofre do servidor, nunca no banco." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Provedor">
            <Select
              defaultValue={psp.provider}
              options={[
                { value: "STRIPE", label: "Stripe" },
                { value: "ASAAS", label: "Asaas", hint: "Em breve", disabled: true },
              ]}
            />
          </Field>
          <Field label="Ambiente" hint="Eventos de outro ambiente são rejeitados.">
            <Select
              defaultValue={psp.environment}
              options={[
                { value: "SANDBOX", label: "Sandbox", hint: "Modo de teste do Stripe" },
                { value: "PRODUCTION", label: "Produção", hint: "Requer conta ativada (KYC)", disabled: true },
              ]}
            />
          </Field>
          <Field label="Referência da chave secreta">
            <Input className="font-mono text-[13px]" defaultValue={psp.credentialRef} />
          </Field>
          <Field label="Conta conectada" hint="Stripe Connect, opcional.">
            <Input className="font-mono text-[13px]" placeholder="acct_…" defaultValue={psp.externalAccountId ?? ""} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Segredo do webhook" subtitle="Durante a rotação, o segredo anterior continua aceito até você removê-lo." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Segredo atual">
            <Input className="font-mono text-[13px]" defaultValue={psp.webhookSecretRef} />
          </Field>
          <Field label="Segredo anterior" hint="Deixe vazio quando a rotação terminar.">
            <Input className="font-mono text-[13px]" placeholder="Nenhum" defaultValue={psp.webhookSecretPreviousRef ?? ""} />
          </Field>
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <DescList
            items={[
              { label: "Endpoint", value: <Mono className="break-all">{psp.webhookUrl}</Mono> },
              { label: "Eventos", value: <Mono className="text-fg-2">payment_intent.*, charge.refunded</Mono> },
              { label: "Validação", value: <span className="text-fg-2">Stripe-Signature, 5 min, até 256 KB</span> },
            ]}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary">Salvar alterações</Button>
      </div>
    </div>
  );
}
