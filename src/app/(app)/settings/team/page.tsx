import { UserPlus } from "lucide-react";
import { Avatar, Button, Card, CardHeader } from "@/components/ui";
import { listUsers } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Equipe" };

export default function TeamPage() {
  const users = listUsers();
  return (
    <Card padded={false}>
      <div className="p-6 pb-0">
        <CardHeader
          title="Equipe"
          subtitle="Admins configuram tudo. Operadores cuidam de clientes e cobranças."
          action={
            <Button size="sm" variant="secondary">
              <UserPlus className="size-3.5" /> Convidar
            </Button>
          }
        />
      </div>
      <ul className="divide-y divide-line border-t border-line">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-4 px-6 py-4">
            <Avatar name={u.name} size={38} />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">{u.name}</div>
              <div className="truncate text-[13px] text-fg-2">{u.email}</div>
            </div>
            <div className="hidden text-right text-[12px] text-fg-3 sm:block">
              {u.lastLoginAt ? `Último acesso ${formatDateTime(u.lastLoginAt)}` : "Convite pendente"}
            </div>
            <span
              className={
                u.role === "ADMIN"
                  ? "rounded-md bg-fg px-2.5 py-1 text-[12px] font-medium text-bg"
                  : "rounded-md bg-gray-soft px-2.5 py-1 text-[12px] text-fg-2"
              }
            >
              {u.role === "ADMIN" ? "Admin" : "Operador"}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
