import { Sidebar } from "@/components/sidebar";
import { VerifyBanner } from "@/components/verify-banner";
import { getCurrentUser, getTenant } from "@/lib/api";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const tenant = getTenant();
  const user = getCurrentUser();
  return (
    <div className="min-h-dvh">
      <Sidebar tenantName={tenant.name} userName={user.name} userEmail={user.email} role={user.role} />
      <main className="lg:pl-[248px]">
        <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          {!user.emailVerifiedAt && <VerifyBanner email={user.email} />}
          {children}
        </div>
      </main>
    </div>
  );
}
