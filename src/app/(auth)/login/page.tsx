import Link from "next/link";
import { CircleAlert, Lock } from "lucide-react";
import { Button, Field, Input } from "@/components/ui";

export const metadata = { title: "Entrar" };

// Demo states: ?erro=1 (wrong credentials) and ?erro=bloqueado (RN-17 lockout after 5 failures).
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string; redefinida?: string }> }) {
  const { erro, redefinida } = await searchParams;
  const locked = erro === "bloqueado";
  return (
    <>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Entrar</h1>
      <p className="mt-1.5 text-[15px] text-fg-2">Bom te ver de novo.</p>

      {redefinida && (
        <div className="mt-6 rounded-md bg-green-soft px-3.5 py-3 text-[13px] text-green">Senha redefinida. Entre com a nova senha.</div>
      )}
      {erro && (
        <div className="mt-6 flex gap-2.5 rounded-md bg-red-soft px-3.5 py-3 text-[13px] text-red">
          {locked ? <Lock className="mt-px size-4 shrink-0" /> : <CircleAlert className="mt-px size-4 shrink-0" />}
          <span>
            {locked
              ? "Muitas tentativas. Aguarde 2 minutos para tentar de novo."
              : "E-mail ou senha incorretos."}
          </span>
        </div>
      )}

      <form action="/dashboard" className="mt-6 space-y-4">
        <Field label="E-mail">
          <Input type="email" name="email" placeholder="voce@empresa.com.br" autoComplete="email" />
        </Field>
        <Field
          label="Senha"
          hint={
            <Link href="/forgot-password" className="text-accent">
              Esqueci minha senha
            </Link>
          }
        >
          <Input type="password" name="password" placeholder="••••••••••••" autoComplete="current-password" />
        </Field>
        <Button variant="primary" size="lg" className="mt-2 w-full" type="submit" disabled={locked}>
          Continuar
        </Button>
      </form>
      <p className="mt-8 text-center text-[14px] text-fg-2">
        Ainda não usa o PinGo?{" "}
        <Link href="/signup" className="font-medium text-fg hover:text-accent">
          Criar conta
        </Link>
      </p>
    </>
  );
}
