// Types mirror the API contract in spec section 12 (docs/api/openapi.yaml).
// Swap for the generated OpenAPI client once the contract is published.

export type Role = "ADMIN" | "OPERATOR";
export type ChargeStatus = "PENDING" | "OVERDUE" | "PAID" | "CANCELED";
export type Channel = "EMAIL" | "SMS";
export type ReminderStatus = "SCHEDULED" | "SENT" | "SKIPPED" | "CANCELED";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "DEAD" | "SKIPPED";

export interface Tenant {
  id: string;
  name: string;
  timezone: string;
  sendWindowStart: string; // "08:00"
  sendWindowEnd: string; // "20:00"
  rateLimitPerMinute: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLoginAt: string | null;
  emailVerifiedAt: string | null;
  lockedUntil: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  emailOptOut: boolean;
  smsOptOut: boolean;
  createdAt: string;
}

export interface Charge {
  id: string;
  customerId: string;
  customerName: string;
  amountCents: number;
  dueDate: string; // YYYY-MM-DD, tenant timezone
  description: string;
  status: ChargeStatus;
  dunningPolicyId: string;
  externalReference: string | null;
  payLink: string;
  pixAttempt: number;
  pixExpiresAt: string | null;
  paidAt: string | null;
  canceledAt: string | null;
  createdAt: string;
}

export interface ChargeStatusHistory {
  id: string;
  fromStatus: ChargeStatus | null;
  toStatus: ChargeStatus;
  reason: string;
  occurredAt: string;
}

export interface ScheduledReminder {
  id: string;
  offsetDays: number;
  channel: Channel;
  templateName: string;
  scheduledFor: string;
  status: ReminderStatus;
}

export interface Notification {
  id: string;
  reminderId: string;
  channel: Channel;
  recipient: string;
  status: NotificationStatus;
  statusReason: string | null;
  attempts: number;
  renderedSubject: string | null;
  renderedBody: string;
  sentAt: string | null;
  createdAt: string;
}

export interface DunningStep {
  id: string;
  offsetDays: number; // negative = before due date
  channel: Channel;
  templateId: string;
}

export interface DunningPolicy {
  id: string;
  name: string;
  isDefault: boolean;
  steps: DunningStep[];
  updatedAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: Channel;
  subject: string | null;
  body: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export interface PspAccount {
  id: string;
  provider: "STRIPE" | "ASAAS";
  environment: "SANDBOX" | "PRODUCTION";
  credentialRef: string;
  webhookSecretRef: string;
  webhookSecretPreviousRef: string | null; // still accepted while rotating (RN-21)
  externalAccountId: string | null;
  webhookUrl: string;
  lastEventAt: string | null;
}

export interface DashboardSummary {
  periodLabel: string;
  billedCents: number;
  receivedCents: number;
  overdueCents: number;
  recoveryRate: number; // 0..1
  aging: { bucket: "0–7" | "8–30" | "30+"; cents: number; count: number }[];
  daily: { date: string; billedCents: number; receivedCents: number }[];
}

export interface PublicCharge {
  tenantName: string;
  customerFirstName: string;
  amountCents: number;
  dueDate: string;
  description: string;
  status: ChargeStatus;
}

export interface PixPayment {
  copyPaste: string;
  qrImageUrl: string | null;
  expiresAt: string;
}

export type AuditAction =
  | "API_KEY_CREATED"
  | "API_KEY_REVOKED"
  | "USER_INVITED"
  | "USER_ROLE_CHANGED"
  | "PSP_ACCOUNT_UPDATED"
  | "DUNNING_POLICY_UPDATED"
  | "CHARGE_CANCELED"
  | "PASSWORD_RESET_COMPLETED";

export interface AuditEntry {
  id: string;
  actorType: "USER" | "API_KEY" | "SYSTEM";
  actorName: string | null;
  action: AuditAction;
  resourceType: string | null;
  resourceLabel: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}
