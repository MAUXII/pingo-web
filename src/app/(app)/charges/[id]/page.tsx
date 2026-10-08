import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader, ChannelTag, DeliveryBadge, DescList, Mono, PageHeader, StatusBadge, chargeStatusLabel } from "@/components/ui";
import { getCharge, getChargeHistory, getChargeNotifications, getChargeReminders, getDunningPolicy } from "@/lib/api";
import { formatCents, formatDate, formatDateTime, formatOffset } from "@/lib/format";
import { ChargeActions } from "./charge-actions";
import { NotificationList } from "./notification-list";

export const metadata = { title: "Cobrança" };

export default async function ChargePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const charge = getCharge(id);
  // RN-11: another tenant's charge is indistinguishable from a missing one.
  if (!charge) notFound();

  const history = getChargeHistory(id);
  const reminders = getChargeReminders(id);
  const notifications = getChargeNotifications(id);
  const policy = getDunningPolicy(charge.dunningPolicyId);

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/charges" className="inline-flex items-center gap-1 hover:text-fg">
            <ChevronLeft className="size-4" /> Cobranças
          </Link>
        }
        title={formatCents(charge.amountCents)}
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={charge.status} />
            <span>
              {charge.customerName} · vence {formatDate(charge.dueDate)}
            </span>
          </span>
        }
        actions={<ChargeActions status={charge.status} payLink={charge.payLink} pixAttempt={charge.pixAttempt} />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader title="Lembretes" subtitle={`Materializados da régua “${policy?.name}” na criação`} />
            <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line-strong">
              {reminders.map((r) => (
                <li key={r.id} className="relative flex items-start gap-4 pl-6">
                  <span
                    className={`absolute top-1.5 left-0 size-[11px] rounded-full ring-4 ring-surface ${
                      r.status === "SENT" ? "bg-green" : r.status === "SCHEDULED" ? "bg-surface ring-1 shadow-[inset_0_0_0_2px_var(--fg-3)]" : "bg-fg-3"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium">{formatOffset(r.offsetDays)}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] text-fg-2">
                      <ChannelTag channel={r.channel} /> · {r.templateName}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <DeliveryBadge status={r.status} />
                    <span className="text-[12px] text-fg-3">{formatDateTime(r.scheduledFor)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card padded={false}>
            <div className="p-6 pb-0">
              <CardHeader title="Notificações" subtitle="Texto exatamente como o cliente recebeu" />
            </div>
            <NotificationList items={notifications} />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Detalhes" />
            <DescList
              items={[
                { label: "Cliente", value: <Link href={`/customers/${charge.customerId}`} className="text-accent">{charge.customerName}</Link> },
                { label: "Descrição", value: charge.description },
                { label: "Vencimento", value: formatDate(charge.dueDate) },
                { label: "Régua", value: policy?.name },
                { label: "Referência", value: charge.externalReference ? <Mono>{charge.externalReference}</Mono> : <span className="text-fg-3">—</span> },
                { label: "ID", value: <Mono className="text-fg-2">{charge.id}</Mono> },
              ]}
            />
          </Card>

          <Card>
            <CardHeader title="Pix" subtitle="Gerado sob demanda quando o link é aberto" />
            <DescList
              items={[
                { label: "Tentativas", value: <Mono>pix_attempt {charge.pixAttempt}</Mono> },
                {
                  label: "Expira",
                  value: charge.pixExpiresAt ? formatDateTime(charge.pixExpiresAt) : <span className="text-fg-3">Ainda não gerado</span>,
                },
                { label: "Link público", value: <Mono className="text-fg-2">/pay/{charge.payLink.split("/pay/")[1]?.slice(0, 10)}…</Mono> },
              ]}
            />
          </Card>

          <Card>
            <CardHeader title="Histórico" />
            <ol className="space-y-4">
              {history.map((h) => (
                <li key={h.id} className="text-[13px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">
                      {h.fromStatus ? `${chargeStatusLabel(h.fromStatus)} → ` : ""}
                      {chargeStatusLabel(h.toStatus)}
                    </span>
                    <span className="text-[12px] whitespace-nowrap text-fg-3">{formatDateTime(h.occurredAt)}</span>
                  </div>
                  <div className="mt-0.5 text-fg-2">{h.reason}</div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
