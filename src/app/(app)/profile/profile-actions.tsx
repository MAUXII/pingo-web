"use client";

import { useState } from "react";
import { Check, MailCheck } from "lucide-react";
import { Button, Card, CardHeader } from "@/components/ui";

export function SaveName() {
  const [saved, setSaved] = useState(false);
  return (
    <Button variant="primary" onClick={() => setSaved(true)} disabled={saved}>
      {saved ? (
        <>
          <Check className="size-4" /> Salvo
        </>
      ) : (
        "Salvar"
      )}
    </Button>
  );
}

// The spec has no "change password while logged in" endpoint, so this reuses the reset flow (RF-34).
export function PasswordCard({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  return (
    <Card>
      <CardHeader title="Senha" subtitle="Mandamos um link para o seu e-mail. Ao trocar, todas as sessões abertas são encerradas." />
      {sent ? (
        <p className="flex items-center gap-2 text-[14px] text-green">
          <MailCheck className="size-4" /> Link enviado para {email}. Ele vale por 30 minutos.
        </p>
      ) : (
        <Button onClick={() => setSent(true)}>Enviar link para trocar a senha</Button>
      )}
    </Card>
  );
}
