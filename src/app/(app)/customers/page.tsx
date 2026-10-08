import Link from "next/link";
import clsx from "clsx";
import { Plus, Search, Upload } from "lucide-react";
import { Avatar, Button, Card, PageHeader, Table, Td, Th, inputCls } from "@/components/ui";
import { chargesForCustomer, listCustomers } from "@/lib/api";
import { formatCents } from "@/lib/format";

export const metadata = { title: "Clientes" };

export default function CustomersPage() {
  const customers = listCustomers();
  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle="Quem você cobra. Pelo menos um contato, e-mail ou telefone, é obrigatório."
        actions={
          <>
            <Button variant="secondary" disabled title="Importação CSV chega numa próxima versão">
              <Upload className="size-4" /> Importar CSV
            </Button>
            <Button variant="primary" href="/customers/new">
              <Plus className="size-4" strokeWidth={2.2} /> Novo cliente
            </Button>
          </>
        }
      />

      <div className="relative mb-4 sm:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-fg-3" />
        <input placeholder="Buscar por nome, e-mail ou CPF" className={clsx(inputCls, "pl-10")} />
      </div>

      <Card padded={false} className="overflow-hidden">
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th className="hidden md:table-cell">Contato</Th>
              <Th className="hidden sm:table-cell">Canais</Th>
              <Th className="text-right">Em aberto</Th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const open = chargesForCustomer(c.id).filter((x) => x.status === "PENDING" || x.status === "OVERDUE");
              const overdue = open.some((x) => x.status === "OVERDUE");
              const total = open.reduce((a, x) => a + x.amountCents, 0);
              return (
                <tr key={c.id} className="hover:bg-surface-2">
                  <Td>
                    <Link href={`/customers/${c.id}`} className="flex items-center gap-3">
                      <Avatar name={c.name} size={34} />
                      <span className="font-medium hover:text-accent">{c.name}</span>
                    </Link>
                  </Td>
                  <Td className="hidden text-fg-2 md:table-cell">
                    <div>{c.email ?? "—"}</div>
                    <div className="text-[13px] text-fg-3">{c.phone ?? "Sem telefone"}</div>
                  </Td>
                  <Td className="hidden sm:table-cell">
                    <div className="flex gap-1.5">
                      <ChannelPill label="E-mail" active={!!c.email && !c.emailOptOut} optOut={c.emailOptOut} />
                      <ChannelPill label="SMS" active={!!c.phone && !c.smsOptOut} optOut={c.smsOptOut} />
                    </div>
                  </Td>
                  <Td className="text-right">
                    {total > 0 ? (
                      <span className={clsx("tabular font-medium", overdue && "text-red")}>{formatCents(total)}</span>
                    ) : (
                      <span className="text-fg-3">Em dia</span>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}

function ChannelPill({ label, active, optOut }: { label: string; active: boolean; optOut: boolean }) {
  return (
    <span
      title={optOut ? "Opt-out" : undefined}
      className={clsx(
        "inline-flex h-6 items-center rounded-md px-2 text-[12px]",
        active ? "bg-gray-soft text-fg" : "text-fg-3 shadow-[inset_0_0_0_1px_var(--line)]",
        optOut && "line-through",
      )}
    >
      {label}
    </span>
  );
}
