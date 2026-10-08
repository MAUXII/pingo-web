"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleAlert } from "lucide-react";
import clsx from "clsx";
import { Button, Field, Input } from "@/components/ui";

const MIN = 12;

export function ResetForm({ expired }: { expired: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  if (expired) {
    return (
      <>
        <span className="flex size-11 items-center justify-center rounded-md bg-red-soft text-red">
          <CircleAlert className="size-5" />
        </span>
        <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.03em]">Link expirado</h1>
        <p className="mt-1.5 text-[15px] text-fg-2">Este link já foi usado ou passou dos 30 minutos. Peça um novo.</p>
        <Button href="/forgot-password" variant="primary" size="lg" className="mt-8 w-full">
          Pedir novo link
        </Button>
      </>
    );
  }

  const longEnough = password.length >= MIN;
  const matches = confirm.length > 0 && confirm === password;

  return (
    <>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Nova senha</h1>
      <p className="mt-1.5 text-[15px] text-fg-2">Ao salvar, todas as sessões abertas são encerradas.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/login?redefinida=1");
        }}
      >
        <Field label="Nova senha">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="••••••••••••" />
        </Field>
        <Field label="Confirmar senha">
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" placeholder="••••••••••••" />
        </Field>
        <ul className="space-y-1.5 text-[13px]">
          <Rule ok={longEnough}>Pelo menos {MIN} caracteres</Rule>
          <Rule ok={matches}>As duas senhas são iguais</Rule>
        </ul>
        <Button variant="primary" size="lg" className="mt-2 w-full" type="submit" disabled={!longEnough || !matches}>
          Salvar nova senha
        </Button>
      </form>
    </>
  );
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={clsx("flex items-center gap-2 transition-colors", ok ? "text-green" : "text-fg-3")}>
      <span className={clsx("flex size-4 items-center justify-center rounded-full", ok ? "bg-green-soft" : "bg-gray-soft")}>
        {ok && <Check className="size-3" strokeWidth={3} />}
      </span>
      {children}
    </li>
  );
}
