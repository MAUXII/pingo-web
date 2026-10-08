import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { CustomerForm } from "../customer-form";

export const metadata = { title: "Novo cliente" };

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow={
          <Link href="/customers" className="inline-flex items-center gap-1 hover:text-fg">
            <ChevronLeft className="size-4" /> Clientes
          </Link>
        }
        title="Novo cliente"
      />
      <CustomerForm />
    </div>
  );
}
