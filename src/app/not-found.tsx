import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[13px] text-fg-3">404</p>
      <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">Não encontramos esta página</h1>
      <p className="mt-2 text-[15px] text-fg-2">Ela pode ter sido removida ou o endereço está incorreto.</p>
      <Button variant="primary" href="/dashboard" className="mt-8">
        Voltar ao início
      </Button>
    </main>
  );
}
