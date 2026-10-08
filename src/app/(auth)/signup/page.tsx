import Link from "next/link";
import { Button, Field, Input } from "@/components/ui";

export const metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Criar conta</h1>
      <p className="mt-1.5 text-[15px] text-fg-2">Grátis no modo de teste. Sem cartão.</p>
      <form action="/dashboard" className="mt-8 space-y-4">
        <Field label="Nome da empresa">
          <Input name="tenant" placeholder="Studio Aurora" />
        </Field>
        <Field label="Seu nome">
          <Input name="name" placeholder="Mauricio Corleone" autoComplete="name" />
        </Field>
        <Field label="E-mail de trabalho">
          <Input type="email" name="email" placeholder="voce@empresa.com.br" autoComplete="email" />
        </Field>
        <Field label="Senha" hint="Pelo menos 12 caracteres.">
          <Input type="password" name="password" placeholder="••••••••••••" minLength={12} autoComplete="new-password" />
        </Field>
        <Button variant="primary" size="lg" className="mt-2 w-full" type="submit">
          Criar conta
        </Button>
        <p className="text-center text-[12px] text-fg-3">Você será o admin da empresa e poderá convidar sua equipe depois.</p>
      </form>
      <p className="mt-8 text-center text-[14px] text-fg-2">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-fg hover:text-accent">
          Entrar
        </Link>
      </p>
    </>
  );
}
