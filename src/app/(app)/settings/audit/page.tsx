import { Bot, KeyRound, User } from "lucide-react";
import { Card, Mono, Table, Td, Th } from "@/components/ui";
import { listAuditLog } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { AuditAction } from "@/lib/types";

export const metadata = { title: "Auditoria" };

const actionLabel: Record<AuditAction, string> = {
  API_KEY_CREATED: "Criou API key",
  API_KEY_REVOKED: "Revogou API key",
  USER_INVITED: "Convidou usuário",
  USER_ROLE_CHANGED: "Alterou perfil",
  PSP_ACCOUNT_UPDATED: "Alterou conta de pagamento",
  DUNNING_POLICY_UPDATED: "Editou régua",
  CHARGE_CANCELED: "Cancelou cobrança",
  PASSWORD_RESET_COMPLETED: "Redefiniu a senha",
};

export default function AuditPage() {
  const entries = listAuditLog();
  return (
    <>
      <p className="mb-4 text-[14px] text-fg-2">Registro imutável das ações sensíveis da sua empresa. Ninguém consegue editar ou apagar.</p>
      <Card padded={false} className="overflow-hidden">
        <Table>
          <thead>
            <tr>
              <Th>Quando</Th>
              <Th>Quem</Th>
              <Th>Ação</Th>
              <Th className="hidden md:table-cell">Recurso</Th>
              <Th className="hidden lg:table-cell">IP</Th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const Icon = e.actorType === "API_KEY" ? KeyRound : e.actorType === "SYSTEM" ? Bot : User;
              return (
                <tr key={e.id}>
                  <Td className="whitespace-nowrap text-fg-2">{formatDateTime(e.createdAt)}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <Icon className="size-3.5 text-fg-3" />
                      {e.actorName ?? "Sistema"}
                    </span>
                  </Td>
                  <Td className="font-medium whitespace-nowrap">{actionLabel[e.action]}</Td>
                  <Td className="hidden max-w-[280px] truncate text-fg-2 md:table-cell">{e.resourceLabel ?? "—"}</Td>
                  <Td className="hidden text-fg-3 lg:table-cell">
                    <Mono>{e.ipAddress ?? "—"}</Mono>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
