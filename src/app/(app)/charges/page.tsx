import Link from "next/link";
import clsx from "clsx";
import { Plus, Search, Download } from "lucide-react";
import { Button, Card, PageHeader, StatusBadge, Table, Td, Th, Mono, inputCls } from "@/components/ui";
import { listCharges } from "@/lib/api";
import { formatCents, formatDate } from "@/lib/format";
import type { ChargeStatus } from "@/lib/types";

export const metadata = { title: "Cobranças" };

const tabs: { key: ChargeStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Todas" },
  { key: "PENDING", label: "Pendentes" },
  { key: "OVERDUE", label: "Em atraso" },
  { key: "PAID", label: "Pagas" },
  { key: "CANCELED", label: "Canceladas" },
];

export default async function ChargesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status = (tabs.find((t) => t.key === sp.status)?.key ?? "ALL") as ChargeStatus | "ALL";
  const page = listCharges({ status, q: sp.q });
  const counts = Object.fromEntries(tabs.map((t) => [t.key, listCharges({ status: t.key }).totalElements]));

  return (
    <>
      <PageHeader
        title="Cobranças"
        subtitle="Tudo o que você tem a receber, com o Pix gerado na hora em que o cliente abre o link."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Exportar
            </Button>
            <Button variant="primary" href="/charges/new">
              <Plus className="size-4" strokeWidth={2.2} /> Nova cobrança
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar inline-flex max-w-full overflow-x-auto rounded-lg bg-gray-soft p-1">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.key === "ALL" ? "/charges" : `/charges?status=${t.key}`}
              className={clsx(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3.5 text-[13px] transition",
                status === t.key ? "bg-surface font-medium text-fg shadow-card" : "text-fg-2 hover:text-fg",
              )}
            >
              {t.label}
              <span className="tabular text-[12px] text-fg-3">{counts[t.key]}</span>
            </Link>
          ))}
        </div>
        <form className="relative sm:w-72">
          {status !== "ALL" && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-fg-3" />
          <input name="q" defaultValue={sp.q} placeholder="Buscar cliente ou descrição" className={clsx(inputCls, "h-10 pl-10")} />
        </form>
      </div>

      <Card padded={false} className="overflow-hidden">
        <Table>
          <thead>
            <tr>
              <Th>Cliente</Th>
              <Th className="hidden md:table-cell">Descrição</Th>
              <Th>Vencimento</Th>
              <Th className="text-right">Valor</Th>
              <Th>Status</Th>
              <Th className="hidden lg:table-cell">ID</Th>
            </tr>
          </thead>
          <tbody>
            {page.content.map((c) => (
              <tr key={c.id} className="group cursor-pointer hover:bg-surface-2">
                <Td>
                  <Link href={`/charges/${c.id}`} className="font-medium hover:text-accent">
                    {c.customerName}
                  </Link>
                </Td>
                <Td className="hidden max-w-[260px] truncate text-fg-2 md:table-cell">{c.description}</Td>
                <Td className={clsx("whitespace-nowrap", c.status === "OVERDUE" ? "text-red" : "text-fg-2")}>{formatDate(c.dueDate)}</Td>
                <Td className="tabular text-right font-medium whitespace-nowrap">{formatCents(c.amountCents)}</Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td className="hidden text-fg-3 lg:table-cell">
                  <Mono>{c.id}</Mono>
                </Td>
              </tr>
            ))}
            {page.content.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-[14px] text-fg-2">
                  Nenhuma cobrança encontrada com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="flex items-center justify-between px-5 py-3 text-[13px] text-fg-2">
          <span>
            {page.totalElements} {page.totalElements === 1 ? "cobrança" : "cobranças"}
          </span>
          <span className="flex gap-1">
            <Button size="sm" variant="ghost" disabled>
              Anterior
            </Button>
            <Button size="sm" variant="ghost" disabled>
              Próxima
            </Button>
          </span>
        </div>
      </Card>
    </>
  );
}
