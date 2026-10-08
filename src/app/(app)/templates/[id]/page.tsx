import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { getTemplate } from "@/lib/api";
import type { MessageTemplate } from "@/lib/types";
import { TemplateEditor } from "./template-editor";

export const metadata = { title: "Template" };

const blank: MessageTemplate = {
  id: "new",
  name: "Novo template",
  channel: "EMAIL",
  subject: "",
  body: "Oi, {{customer_name}}! ",
  updatedAt: "",
};

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = id === "new" ? blank : getTemplate(id);
  if (!template) notFound();
  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/templates" className="inline-flex items-center gap-1 hover:text-fg">
            <ChevronLeft className="size-4" /> Templates
          </Link>
        }
        title={template.name}
      />
      <TemplateEditor template={template} />
    </>
  );
}
