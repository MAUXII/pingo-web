import { PageHeader } from "@/components/ui";
import { SettingsNav } from "./settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader title="Configurações" subtitle="Só administradores podem alterar estas opções." />
      <SettingsNav />
      <div className="max-w-3xl">{children}</div>
    </>
  );
}
