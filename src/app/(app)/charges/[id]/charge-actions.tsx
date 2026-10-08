"use client";

import { useState } from "react";
import { Check, Link2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import type { ChargeStatus } from "@/lib/types";

export function ChargeActions({ status, payLink, pixAttempt }: { status: ChargeStatus; payLink: string; pixAttempt: number }) {
  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState<null | "cancel" | "regenerate">(null);
  const open = status === "PENDING" || status === "OVERDUE";

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          navigator.clipboard?.writeText(payLink);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? "Copiado" : "Copiar link"}
      </Button>
      {open && (
        <>
          <Button variant="secondary" onClick={() => setConfirm("regenerate")}>
            <RefreshCw className="size-4" /> Regenerar Pix
          </Button>
          <Button variant="danger" onClick={() => setConfirm("cancel")}>
            <XCircle className="size-4" /> Cancelar
          </Button>
        </>
      )}

      <Dialog open={confirm === "cancel"} onClose={() => setConfirm(null)}>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Cancelar esta cobrança?</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-fg-2">
          O Pix em aberto será cancelado no Stripe e os lembretes agendados não serão mais enviados. Essa ação não pode ser desfeita.
        </p>
        <div className="mt-7 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(null)}>
            Voltar
          </Button>
          <Button variant="danger" onClick={() => setConfirm(null)}>
            Cancelar cobrança
          </Button>
        </div>
      </Dialog>

      <Dialog open={confirm === "regenerate"} onClose={() => setConfirm(null)}>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Gerar um novo Pix?</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-fg-2">
          Um novo pagamento é criado no Stripe e o anterior é cancelado. O link da cobrança continua o mesmo.
        </p>
        <div className="mt-4 rounded-xl bg-surface-2 px-4 py-3 font-mono text-[12px] text-fg-2 ring-1 ring-line">
          pix_attempt {pixAttempt} → {pixAttempt + 1}
        </div>
        <div className="mt-7 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(null)}>
            Voltar
          </Button>
          <Button variant="primary" onClick={() => setConfirm(null)}>
            Gerar novo Pix
          </Button>
        </div>
      </Dialog>
    </>
  );
}
