import { Logo } from "@/components/ui";

const lines = [
  { c: "text-fg-3", t: "$ pingo régua --tenant studio-aurora" },
  { c: "text-fg", t: "● D-3  e-mail  Camila Ferreira      enviado" },
  { c: "text-fg", t: "● D0   e-mail  Rafael Moura         enviado" },
  { c: "text-fg-3", t: "  ↳ janela 08h–20h · tentativa 1/5" },
  { c: "text-fg", t: "● Pix  gerado  Juliana Costa        R$ 289,00" },
  { c: "text-green", t: "✓ pago         Juliana Costa        lembretes cancelados" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>
        <p className="text-[12px] text-fg-3">© 2026 PinGo · Termos · Privacidade</p>
      </div>
      <div className="relative hidden overflow-hidden bg-surface lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="absolute -top-40 -right-40 size-[520px] rounded-full bg-accent/10 blur-3xl" />
        <div className="relative">
          <h2 className="max-w-md text-[40px] leading-[1.05] font-semibold tracking-[-0.035em]">
            Cobre uma vez.
            <br />
            <span className="text-fg-3">O PinGo lembra o resto.</span>
          </h2>
          <p className="mt-4 max-w-md text-[16px] text-fg-2">
            Pix gerado na hora, lembretes por e-mail e SMS no tempo certo e baixa automática quando o pagamento cai.
          </p>
          <div className="mt-10 max-w-lg rounded-2xl bg-bg p-5 font-mono text-[12.5px] leading-[1.9] ring-1 ring-line">
            <div className="mb-3 flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            {lines.map((l) => (
              <div key={l.t} className={`${l.c} whitespace-pre`}>
                {l.t}
              </div>
            ))}
            <div className="caret text-fg-3">$ </div>
          </div>
        </div>
      </div>
    </div>
  );
}
