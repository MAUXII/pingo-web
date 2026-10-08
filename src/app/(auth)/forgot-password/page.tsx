import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button, Field, Input } from "@/components/ui";

export const metadata = { title: "Esqueci minha senha" };

// RF-34: the API always answers 202, so the screen never says whether the e-mail exists.
export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ enviado?: string }> }) {
  const { enviado } = await searchParams;
  if (enviado) {
    return (
      <>
        <span className="flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent">
          <MailCheck className="size-5" />
        </span>
        <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.03em]">Confira seu e-mail</h1>
        <p className="mt-1.5 text-[15px] text-fg-2">
          Se existir uma conta com esse e-mail, enviamos um link para criar uma nova senha. Ele vale por 30 minutos e só pode ser usado uma vez.
        </p>
        <Button href="/login" variant="secondary" size="lg" className="mt-8 w-full">
          Voltar para o login
        </Button>
      </>
    );
  }
  return (
    <>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Esqueci minha senha</h1>
      <p className="mt-1.5 text-[15px] text-fg-2">Informe seu e-mail e mandamos um link para redefinir.</p>
      <form action="/forgot-password" className="mt-8 space-y-4">
        <input type="hidden" name="enviado" value="1" />
        <Field label="E-mail">
          <Input type="email" name="email" placeholder="voce@empresa.com.br" autoComplete="email" required />
        </Field>
        <Button variant="primary" size="lg" className="mt-2 w-full" type="submit">
          Enviar link
        </Button>
      </form>
      <Link href="/login" className="mt-8 inline-flex items-center gap-1.5 text-[14px] text-fg-2 hover:text-fg">
        <ArrowLeft className="size-4" /> Voltar para o login
      </Link>
    </>
  );
}
