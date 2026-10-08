import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { getDunningPolicy, listTemplates } from "@/lib/api";
import type { DunningPolicy } from "@/lib/types";
import { PolicyEditor } from "./policy-editor";

export const metadata = { title: "Régua" };

const blank: DunningPolicy = {
  id: "new",
  name: "Nova régua",
  isDefault: false,
  updatedAt: "",
  steps: [{ id: "s1", offsetDays: -2, channel: "EMAIL", templateId: "tp_01" }],
};

export default async function PolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const policy = id === "new" ? blank : getDunningPolicy(id);
  if (!policy) notFound();

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/dunning" className="inline-flex items-center gap-1 hover:text-fg">
            <ChevronLeft className="size-4" /> Réguas
          </Link>
        }
        title={policy.name}
      />
      <PolicyEditor policy={policy} templates={listTemplates()} />
    </>
  );
}
