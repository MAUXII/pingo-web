"use client";

import { useState } from "react";
import { Check, MailX } from "lucide-react";
import { Button } from "@/components/ui";

export default function UnsubscribePage() {
  const [done, setDone] = useState(false);
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-[380px] rounded-3xl bg-surface p-8 text-center shadow-pop ring-1 ring-line">
        <div className={`mx-auto mb-5 flex size-14 items-center justify-center rounded-full ${done ? "bg-green-soft" : "bg-gray-soft"}`}>
          {done ? <Check className="size-7 text-green" strokeWidth={2.4} /> : <MailX className="size-6 text-fg-2" />}
        </div>
        {done ? (
          <>
            <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Pronto, você saiu da lista</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-fg-2">
              Studio Aurora não vai mais enviar lembretes por e-mail. Suas cobranças continuam disponíveis pelo link de pagamento.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Parar de receber lembretes?</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-fg-2">
              Você não receberá mais e-mails de lembrete do Studio Aurora. Isso não cancela nenhuma cobrança.
            </p>
            <Button variant="primary" size="lg" className="mt-7 w-full" onClick={() => setDone(true)}>
              Descadastrar
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
