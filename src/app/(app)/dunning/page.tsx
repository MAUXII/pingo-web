import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { Button, Card, PageHeader } from "@/components/ui";
import { PolicyTimeline } from "@/components/policy-timeline";
import { listDunningPolicies } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Réguas" };

export default function DunningPage() {
  const policies = listDunningPolicies();
  return (
    <>
      <PageHeader
        title="Réguas de cobrança"
        subtitle="Quando e por onde lembrar o cliente, antes e depois do vencimento."
        actions={
          <Button variant="primary" href="/dunning/new">
            <Plus className="size-4" strokeWidth={2.2} /> Nova régua
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {policies.map((p) => (
          <Link key={p.id} href={`/dunning/${p.id}`} className="group">
            <Card className="transition-shadow group-hover:shadow-pop">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-semibold tracking-[-0.02em]">{p.name}</h2>
                    {p.isDefault && (
                      <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">Padrão</span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-fg-2">
                    {p.steps.length} passos · editada em {formatDate(p.updatedAt)}
                  </p>
                </div>
                <ChevronRight className="size-5 text-fg-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <PolicyTimeline steps={p.steps} compact />
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-[13px] text-fg-2">
        Editar uma régua não muda cobranças já criadas. Cada cobrança guarda uma cópia da régua do momento em que nasceu.
      </p>
    </>
  );
}
