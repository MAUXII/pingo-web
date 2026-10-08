import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button, Card, CardHeader, PageHeader, StatusBadge } from "@/components/ui";
import { RevenueChart } from "@/components/revenue-chart";
import { getDashboardSummary, listCharges } from "@/lib/api";
import { formatCents, formatShortDate } from "@/lib/format";

export const metadata = { title: "Visão geral" };

const activity = [
  { t: "11:42", kind: "ok", text: "Pagamento confirmado", detail: "Juliana Costa · R$ 289,00", meta: "payment_intent.succeeded" },
  { t: "11:06", kind: "ok", text: "E-mail enviado", detail: "Rafael Moura · Vence hoje", meta: "tentativa 2/5" },
  { t: "10:58", kind: "info", text: "Pix gerado", detail: "Camila Ferreira · expira em 24 h", meta: "pix_attempt 1" },
  { t: "09:30", kind: "warn", text: "Lembrete ignorado", detail: "Marina Lopes · opt-out de e-mail", meta: "opt_out" },
  { t: "08:00", kind: "info", text: "Janela de envio aberta", detail: "3 lembretes na fila", meta: "08h–20h" },
];

export default function DashboardPage() {
  const s = getDashboardSummary();
  const overdue = listCharges({ status: "OVERDUE" }).content;
  const agingMax = Math.max(...s.aging.map((a) => a.cents));

  const kpis = [
    { label: "Cobrado", value: formatCents(s.billedCents), note: "42 cobranças" },
    { label: "Recebido", value: formatCents(s.receivedCents), note: "+12% vs. mês anterior", up: true },
    { label: "Em atraso", value: formatCents(s.overdueCents), note: "10 cobranças" },
    { label: "Recuperação", value: `${(s.recoveryRate * 100).toFixed(1).replace(".", ",")}%`, note: "pagas após lembrete" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Quarta, 7 de outubro"
        title="Boa tarde, Mauricio"
        subtitle="Aqui está o resumo do Studio Aurora nos últimos 30 dias."
        actions={
          <>
            <Button variant="secondary">Últimos 30 dias</Button>
            <Button variant="primary" href="/charges/new">
              <Plus className="size-4" strokeWidth={2.2} /> Nova cobrança
            </Button>
          </>
        }
      />

      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="!p-5">
            <div className="text-[13px] text-fg-2">{k.label}</div>
            <div className="tabular mt-2 text-[26px] leading-none font-semibold tracking-[-0.03em]">{k.value}</div>
            <div className={k.up ? "mt-2.5 text-[12px] text-green" : "mt-2.5 text-[12px] text-fg-3"}>{k.note}</div>
          </Card>
        ))}
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Fluxo de recebimentos" subtitle="Por dia, no fuso de São Paulo" />
          <RevenueChart data={s.daily} />
        </Card>

        <Card>
          <CardHeader title="Aging" subtitle="Valor em atraso por faixa de dias" />
          <div className="space-y-5">
            {s.aging.map((a, i) => (
              <div key={a.bucket}>
                <div className="mb-2 flex items-baseline justify-between text-[13px]">
                  <span className="text-fg-2">{a.bucket} dias</span>
                  <span className="tabular font-medium">{formatCents(a.cents)}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-soft">
                  <div
                    className="h-2 rounded-full bg-red"
                    style={{ width: `${(a.cents / agingMax) * 100}%`, opacity: 0.45 + i * 0.27 }}
                  />
                </div>
                <div className="mt-1.5 text-[12px] text-fg-3">
                  {a.count} {a.count === 1 ? "cobrança" : "cobranças"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3" padded={false}>
          <div className="p-6 pb-2">
            <CardHeader
              title="Precisam de atenção"
              subtitle="Cobranças em atraso com régua ativa"
              action={
                <Link href="/charges?status=OVERDUE" className="inline-flex items-center gap-1 text-[13px] text-accent">
                  Ver todas <ArrowUpRight className="size-3.5" />
                </Link>
              }
            />
          </div>
          <ul className="divide-y divide-line border-t border-line">
            {overdue.map((c) => (
              <li key={c.id}>
                <Link href={`/charges/${c.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium">{c.customerName}</div>
                    <div className="truncate text-[13px] text-fg-2">
                      Venceu {formatShortDate(c.dueDate)} · {c.description}
                    </div>
                  </div>
                  <span className="tabular text-[14px] font-medium">{formatCents(c.amountCents)}</span>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Atividade" subtitle="Hoje" />
          <ol className="space-y-4 font-mono text-[12.5px] leading-snug">
            {activity.map((a) => (
              <li key={a.t + a.text} className="flex gap-3">
                <span className="text-fg-3">{a.t}</span>
                <span
                  className={
                    a.kind === "ok" ? "text-green" : a.kind === "warn" ? "text-amber" : "text-fg-3"
                  }
                >
                  ●
                </span>
                <span className="min-w-0">
                  <span className="text-fg">{a.text}</span>
                  <span className="block font-sans text-[12.5px] text-fg-2">{a.detail}</span>
                  <span className="block text-fg-3">↳ {a.meta}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </>
  );
}
