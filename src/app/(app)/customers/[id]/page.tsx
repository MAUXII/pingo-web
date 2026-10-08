import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Avatar, Button, Card, CardHeader, StatusBadge } from "@/components/ui";
import { chargesForCustomer, getCustomer } from "@/lib/api";
import { formatCents, formatDate } from "@/lib/format";
import { CustomerForm } from "../customer-form";

export const metadata = { title: "Cliente" };

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = getCustomer(id);
  if (!customer) notFound();
  const charges = chargesForCustomer(id);
  const paid = charges.filter((c) => c.status === "PAID").reduce((a, c) => a + c.amountCents, 0);

  return (
    <>
      <div className="mb-2">
        <Link href="/customers" className="inline-flex items-center gap-1 text-[13px] text-fg-2 hover:text-fg">
          <ChevronLeft className="size-4" /> Clientes
        </Link>
      </div>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size={56} />
          <PageHeaderInline title={customer.name} subtitle={`Cliente desde ${formatDate(customer.createdAt)}`} />
        </div>
        <Button variant="primary" href="/charges/new">
          <Plus className="size-4" strokeWidth={2.2} /> Nova cobrança
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CustomerForm customer={customer} />
        </div>
        <div className="lg:col-span-2">
          <Card padded={false}>
            <div className="p-6 pb-0">
              <CardHeader title="Cobranças" subtitle={`${formatCents(paid)} recebidos no total`} />
            </div>
            <ul className="divide-y divide-line border-t border-line">
              {charges.map((c) => (
                <li key={c.id}>
                  <Link href={`/charges/${c.id}`} className="flex items-center gap-3 px-6 py-3.5 hover:bg-surface-2">
                    <div className="min-w-0 flex-1">
                      <div className="tabular text-[14px] font-medium">{formatCents(c.amountCents)}</div>
                      <div className="truncate text-[13px] text-fg-2">{formatDate(c.dueDate)}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function PageHeaderInline({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">{title}</h1>
      <p className="text-[14px] text-fg-2">{subtitle}</p>
    </div>
  );
}

