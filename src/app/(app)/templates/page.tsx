import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { Button, Card, ChannelTag, PageHeader } from "@/components/ui";
import { listTemplates } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Templates" };

export default function TemplatesPage() {
  const templates = listTemplates();
  return (
    <>
      <PageHeader
        title="Templates"
        subtitle="As mensagens que a régua envia. Tom respeitoso, sem constranger ninguém."
        actions={
          <Button variant="primary" href="/templates/new">
            <Plus className="size-4" strokeWidth={2.2} /> Novo template
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((t) => (
          <Link key={t.id} href={`/templates/${t.id}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-pop">
              <div className="mb-3 flex items-center justify-between">
                <ChannelTag channel={t.channel} />
                <ChevronRight className="size-4 text-fg-3" />
              </div>
              <h2 className="text-[16px] font-semibold tracking-[-0.01em]">{t.name}</h2>
              {t.subject && <p className="mt-0.5 text-[13px] text-fg-2">{t.subject}</p>}
              <p className="mt-3 line-clamp-2 font-mono text-[12px] leading-relaxed text-fg-3">{t.body}</p>
              <p className="mt-4 text-[12px] text-fg-3">Editado em {formatDate(t.updatedAt)}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
