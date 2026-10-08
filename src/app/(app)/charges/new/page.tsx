import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { listCustomers, listDunningPolicies, listTemplates } from "@/lib/api";
import { TODAY } from "@/mocks/data";
import { NewChargeForm } from "./new-charge-form";

export const metadata = { title: "Nova cobrança" };

export default function NewChargePage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/charges" className="inline-flex items-center gap-1 hover:text-fg">
            <ChevronLeft className="size-4" /> Cobranças
          </Link>
        }
        title="Nova cobrança"
        subtitle="A criação não chama o PSP. O Pix nasce quando o cliente abre o link."
      />
      <NewChargeForm customers={listCustomers()} policies={listDunningPolicies()} templates={listTemplates()} today={TODAY} />
    </>
  );
}
