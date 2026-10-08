// Mock API layer. Function names and shapes follow spec section 12 so each one can
// be replaced by the generated OpenAPI client (or MSW handlers) without touching screens.
import * as db from "@/mocks/data";
import type { Charge, ChargeStatus, Page, PublicCharge } from "./types";

export const getTenant = () => db.tenant;
export const getCurrentUser = () => db.currentUser;

export function listCharges(filters: { status?: ChargeStatus | "ALL"; q?: string } = {}): Page<Charge> {
  let content = db.charges;
  if (filters.status && filters.status !== "ALL") content = content.filter((c) => c.status === filters.status);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    content = content.filter((c) => c.customerName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }
  return { content, page: 0, size: 20, totalElements: content.length };
}

export const getCharge = (id: string) => db.charges.find((c) => c.id === id) ?? null;

export const getChargeHistory = (id: string) =>
  db.chargeHistory[id] ?? [
    { id: "h0", fromStatus: null, toStatus: "PENDING" as const, reason: "Cobrança criada por Mauricio Corleone", occurredAt: "2026-09-25T13:00:00Z" },
  ];

export const getChargeReminders = (id: string) => db.reminders[id] ?? db.reminders.ch_1041!;
export const getChargeNotifications = (id: string) => db.notifications[id] ?? [];

export const listCustomers = () => db.customers;
export const getCustomer = (id: string) => db.customers.find((c) => c.id === id) ?? null;
export const chargesForCustomer = (id: string) => db.charges.filter((c) => c.customerId === id);

export const listDunningPolicies = () => db.dunningPolicies;
export const getDunningPolicy = (id: string) => db.dunningPolicies.find((p) => p.id === id) ?? null;

export const listTemplates = () => db.templates;
export const getTemplate = (id: string) => db.templates.find((t) => t.id === id) ?? null;

export const listUsers = () => db.users;
export const listApiKeys = () => db.apiKeys;
export const getPspAccount = () => db.pspAccount;
export const getDashboardSummary = () => db.dashboard;
export const listAuditLog = () => db.auditLog;

export function getPublicCharge(token: string): PublicCharge | null {
  // Demo tokens: "demo" (pending), "pago" (paid), "atraso" (overdue), "cancelada" (canceled).
  const byToken: Record<string, string> = { demo: "ch_1042", pago: "ch_1040", atraso: "ch_1041", cancelada: "ch_1036" };
  const charge = db.charges.find((c) => c.id === (byToken[token] ?? "ch_1042"));
  if (!charge) return null;
  return {
    tenantName: db.tenant.name,
    customerFirstName: charge.customerName.split(" ")[0]!,
    amountCents: charge.amountCents,
    dueDate: charge.dueDate,
    description: charge.description,
    status: charge.status,
  };
}
