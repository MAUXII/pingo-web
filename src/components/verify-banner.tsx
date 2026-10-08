"use client";

import { useState } from "react";
import { MailWarning, X } from "lucide-react";

export function VerifyBanner({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="mb-8 flex items-center gap-3 rounded-md bg-amber-soft px-4 py-3 text-[13px]">
      <MailWarning className="size-4 shrink-0 text-amber" />
      <p className="flex-1 text-fg">
        Confirme seu e-mail. Enviamos um link para <span className="font-medium">{email}</span>.
      </p>
      <button
        type="button"
        disabled={sent}
        onClick={() => setSent(true)}
        className="shrink-0 font-medium text-accent disabled:text-fg-3"
      >
        {sent ? "Reenviado" : "Reenviar"}
      </button>
      <button type="button" onClick={() => setHidden(true)} aria-label="Fechar" className="shrink-0 text-fg-3 hover:text-fg">
        <X className="size-4" />
      </button>
    </div>
  );
}
