import { Avatar, Card, CardHeader, DescList, Field, Input, PageHeader } from "@/components/ui";
import { ThemeCards } from "@/components/theme-picker";
import { getCurrentUser } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { PasswordCard, SaveName } from "./profile-actions";

export const metadata = { title: "Meu perfil" };

export default function ProfilePage() {
  const user = getCurrentUser();
  return (
    <>
      <PageHeader title="Meu perfil" subtitle="Seus dados e preferências. Valem só para a sua conta." />
      <div className="max-w-3xl space-y-6">
        <Card>
          <div className="mb-6 flex items-center gap-4">
            <Avatar name={user.name} size={56} />
            <div className="min-w-0">
              <div className="truncate text-[17px] font-semibold tracking-[-0.02em]">{user.name}</div>
              <div className="truncate text-[13px] text-fg-2">{user.role === "ADMIN" ? "Admin" : "Operador"}</div>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome">
              <Input name="name" defaultValue={user.name} autoComplete="name" />
            </Field>
            <Field label="E-mail" hint={user.emailVerifiedAt ? "Verificado." : <span className="text-amber">Ainda não verificado.</span>}>
              <Input defaultValue={user.email} disabled />
            </Field>
          </div>
          <div className="mt-6 flex justify-end">
            <SaveName />
          </div>
        </Card>

        <Card>
          <CardHeader title="Aparência" subtitle="Fica salvo neste navegador." />
          <ThemeCards />
        </Card>

        <PasswordCard email={user.email} />

        <Card>
          <CardHeader title="Acesso" />
          <DescList
            items={[
              { label: "Perfil", value: user.role === "ADMIN" ? "Admin" : "Operador" },
              { label: "Último acesso", value: user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—" },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
