import { Button, Card, CardHeader, Field, Input, Mono } from "@/components/ui";
import { Select } from "@/components/controls";
import { getTenant } from "@/lib/api";

const hours = Array.from({ length: 24 }, (_, h) => {
  const v = `${String(h).padStart(2, "0")}:00`;
  return { value: v, label: v };
});

export const metadata = { title: "Configurações" };

export default function GeneralSettingsPage() {
  const t = getTenant();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Empresa" subtitle="Aparece nas mensagens e na página de pagamento." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome" className="sm:col-span-2">
            <Input defaultValue={t.name} />
          </Field>
          <Field label="Fuso horário" hint="Define quando uma cobrança vira atrasada.">
            <Select
              defaultValue={t.timezone}
              options={[
                { value: "America/Sao_Paulo", label: "Brasília", hint: "America/Sao_Paulo" },
                { value: "America/Manaus", label: "Manaus", hint: "America/Manaus" },
                { value: "America/Noronha", label: "Noronha", hint: "America/Noronha" },
              ]}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Janela de envio" subtitle="Lembretes fora deste horário esperam a próxima abertura." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Início">
            <Select defaultValue={t.sendWindowStart} options={hours} />
          </Field>
          <Field label="Fim">
            <Select defaultValue={t.sendWindowEnd} options={hours} />
          </Field>
        </div>
        <WindowBar start={8} end={20} />
      </Card>

      <Card>
        <CardHeader title="Limites" />
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-fg-2">Requisições à API por minuto</span>
          <Mono>{t.rateLimitPerMinute} req/min</Mono>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary">Salvar alterações</Button>
      </div>
    </div>
  );
}

function WindowBar({ start, end }: { start: number; end: number }) {
  return (
    <div className="mt-6">
      <div className="relative h-2 rounded-full bg-gray-soft">
        <div className="absolute h-2 rounded-full bg-accent" style={{ left: `${(start / 24) * 100}%`, width: `${((end - start) / 24) * 100}%` }} />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-fg-3">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  );
}
