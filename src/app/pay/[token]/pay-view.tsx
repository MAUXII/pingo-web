"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Clock, CircleSlash, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { FakeQr } from "@/components/fake-qr";
import { formatCents, formatDate } from "@/lib/format";
import type { PixPayment, PublicCharge } from "@/lib/types";

const PIX: PixPayment = {
  copyPaste:
    "00020101021226900014br.gov.bcb.pix2568pix.stripe.com/qr/v2/cobv/9d3a1b7e4c5f4a2e8b6d0c1f2e3a4b5c5204000053039865406289.005802BR5913STUDIO AURORA6009SAO PAULO62070503***6304A1F3",
  qrImageUrl: null,
  expiresAt: "",
};

type Phase = "generating" | "ready" | "error";

export function PayView({ charge, token, forceError }: { charge: PublicCharge; token: string; forceError: boolean }) {
  const [phase, setPhase] = useState<Phase>("generating");
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(23 * 3600 + 59 * 60 + 12);
  const payable = charge.status === "PENDING" || charge.status === "OVERDUE";

  // Simulates POST /public/charges/{token}/pix (RF-09): reuse or create a valid Pix.
  useEffect(() => {
    if (!payable) return;
    const t = setTimeout(() => setPhase(forceError ? "error" : "ready"), 900);
    return () => clearTimeout(t);
  }, [payable, forceError]);

  useEffect(() => {
    if (phase !== "ready") return;
    const i = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, [phase]);

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface text-[20px] font-semibold shadow-card ring-1 ring-line">
          {charge.tenantName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </div>
        <p className="text-[14px] text-fg-2">
          {charge.tenantName} · para {charge.customerFirstName}
        </p>
        <div className="tabular mt-1 text-[44px] leading-none font-semibold tracking-[-0.04em]">{formatCents(charge.amountCents)}</div>
        <p className="mt-2 text-[14px] text-fg-2">{charge.description}</p>
        <p className={`mt-1 text-[13px] ${charge.status === "OVERDUE" ? "text-red" : "text-fg-3"}`}>
          {charge.status === "OVERDUE" ? "Venceu em " : "Vence em "}
          {formatDate(charge.dueDate)}
        </p>
      </div>

      <div className="rounded-3xl bg-surface p-6 shadow-pop ring-1 ring-line">
        {charge.status === "PAID" && (
          <State
            icon={<Check className="size-7 text-green" strokeWidth={2.4} />}
            tone="bg-green-soft"
            title="Pagamento confirmado"
            text="Recebemos seu Pix. Obrigado! Você não vai mais receber lembretes desta cobrança."
          />
        )}

        {charge.status === "CANCELED" && (
          <State
            icon={<CircleSlash className="size-7 text-fg-2" />}
            tone="bg-gray-soft"
            title="Cobrança cancelada"
            text={`Esta cobrança não está mais ativa. Se tiver dúvidas, fale com ${charge.tenantName}.`}
          />
        )}

        {payable && phase === "generating" && (
          <div className="flex flex-col items-center py-10">
            <div className="size-[220px] animate-pulse rounded-2xl bg-gray-soft" />
            <p className="caret mt-6 font-mono text-[13px] text-fg-2">Gerando seu Pix</p>
          </div>
        )}

        {payable && phase === "error" && (
          <State
            icon={<RefreshCw className="size-6 text-amber" />}
            tone="bg-amber-soft"
            title="Não conseguimos gerar o Pix"
            text="O provedor de pagamento não respondeu. Nada foi cobrado. Tente de novo em instantes."
            action={
              <Button variant="primary" onClick={() => setPhase("generating")} className="mt-6">
                Tentar novamente
              </Button>
            }
          />
        )}

        {payable && phase === "ready" && (
          <>
            <div className="flex justify-center">
              <div className="rounded-2xl p-3 ring-1 ring-line">
                <FakeQr seed={token} size={212} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-fg-2">
              <Clock className="size-3.5" />
              Expira em <span className="tabular font-mono">{hh}:{mm}:{ss}</span>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-[13px] font-medium">Pix copia e cola</div>
              <div className="rounded-xl bg-surface-2 p-3 font-mono text-[11.5px] leading-relaxed break-all text-fg-2 ring-1 ring-line">
                {PIX.copyPaste.slice(0, 92)}…
              </div>
              <Button
                variant="primary"
                size="lg"
                className="mt-3 w-full"
                onClick={() => {
                  navigator.clipboard?.writeText(PIX.copyPaste);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Código copiado" : "Copiar código Pix"}
              </Button>
            </div>

            <ol className="mt-6 space-y-2 border-t border-line pt-5 text-[13px] text-fg-2">
              <li>1. Abra o app do seu banco e escolha Pix.</li>
              <li>2. Escaneie o QR Code ou cole o código.</li>
              <li>3. Confirme. A baixa é automática em segundos.</li>
            </ol>
          </>
        )}
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-fg-3">
        <ShieldCheck className="size-3.5" /> Pagamento processado com segurança via Stripe
      </p>
      <p className="mt-1 text-center text-[12px] text-fg-3">
        Cobrança enviada por <span className="font-medium text-fg-2">PinGo</span>
      </p>
    </div>
  );
}

function State({
  icon,
  tone,
  title,
  text,
  action,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className={`mb-5 flex size-14 items-center justify-center rounded-full ${tone}`}>{icon}</div>
      <h2 className="text-[19px] font-semibold tracking-[-0.02em]">{title}</h2>
      <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-fg-2">{text}</p>
      {action}
    </div>
  );
}
