import { getPublicCharge } from "@/lib/api";
import { PayView } from "./pay-view";

export const metadata = { title: "Pagamento", robots: { index: false } };

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const charge = getPublicCharge(token);

  return (
    <main className="flex min-h-dvh items-start justify-center px-4 py-12 sm:items-center">
      {charge ? (
        <PayView charge={charge} token={token} forceError={sp.erro === "psp"} />
      ) : (
        // Same response for unknown token or another tenant's charge (spec section 13).
        <p className="text-[15px] text-fg-2">Link inválido ou expirado.</p>
      )}
    </main>
  );
}
