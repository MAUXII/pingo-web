import { CircleAlert, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui";

export const metadata = { title: "Confirmar e-mail" };

// RF-35. Demo: /verify-email/expirado shows the failure state.
export default async function VerifyEmailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ok = token !== "expirado";
  return (
    <>
      <span className={`flex size-11 items-center justify-center rounded-md ${ok ? "bg-green-soft text-green" : "bg-red-soft text-red"}`}>
        {ok ? <CircleCheck className="size-5" /> : <CircleAlert className="size-5" />}
      </span>
      <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.03em]">{ok ? "E-mail confirmado" : "Link inválido"}</h1>
      <p className="mt-1.5 text-[15px] text-fg-2">
        {ok
          ? "Tudo certo. Sua conta está verificada."
          : "Este link expirou ou já foi usado. Entre na sua conta e peça um novo pelo aviso no topo da tela."}
      </p>
      <Button href={ok ? "/dashboard" : "/login"} variant="primary" size="lg" className="mt-8 w-full">
        {ok ? "Ir para o painel" : "Entrar"}
      </Button>
    </>
  );
}
