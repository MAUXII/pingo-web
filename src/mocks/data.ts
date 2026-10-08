import type {
  ApiKey,
  AuditEntry,
  Charge,
  ChargeStatusHistory,
  Customer,
  DashboardSummary,
  DunningPolicy,
  MessageTemplate,
  Notification,
  PspAccount,
  ScheduledReminder,
  Tenant,
  User,
} from "@/lib/types";

// Fixed "today" so screens render the same every time.
export const TODAY = "2026-10-07";

export const tenant: Tenant = {
  id: "tn_01",
  name: "Studio Aurora",
  timezone: "America/Sao_Paulo",
  sendWindowStart: "08:00",
  sendWindowEnd: "20:00",
  rateLimitPerMinute: 120,
};

export const currentUser: User = {
  id: "us_01",
  name: "Mauricio Corleone",
  email: "mauricio@studioaurora.com.br",
  role: "ADMIN",
  lastLoginAt: "2026-10-07T12:04:00Z",
  emailVerifiedAt: null,
  lockedUntil: null,
};

export const users: User[] = [
  currentUser,
  { id: "us_02", name: "Ana Paula Rocha", email: "ana@studioaurora.com.br", role: "OPERATOR", lastLoginAt: "2026-10-06T19:31:00Z", emailVerifiedAt: "2026-04-02T10:00:00Z", lockedUntil: null },
  { id: "us_03", name: "Bruno Takeda", email: "bruno@studioaurora.com.br", role: "OPERATOR", lastLoginAt: null, emailVerifiedAt: null, lockedUntil: null },
];

export const customers: Customer[] = [
  { id: "cu_01", name: "Camila Ferreira", email: "camila.ferreira@gmail.com", phone: "+55 11 98812-4410", document: "123.456.789-09", emailOptOut: false, smsOptOut: false, createdAt: "2026-03-02T10:00:00Z" },
  { id: "cu_02", name: "Rafael Moura", email: "rafa.moura@outlook.com", phone: "+55 11 99701-2231", document: null, emailOptOut: false, smsOptOut: true, createdAt: "2026-04-11T10:00:00Z" },
  { id: "cu_03", name: "Juliana Costa", email: "ju.costa@icloud.com", phone: null, document: "987.654.321-00", emailOptOut: false, smsOptOut: false, createdAt: "2026-05-20T10:00:00Z" },
  { id: "cu_04", name: "Pedro Henrique Alves", email: null, phone: "+55 21 98123-0098", document: null, emailOptOut: false, smsOptOut: false, createdAt: "2026-06-01T10:00:00Z" },
  { id: "cu_05", name: "Marina Lopes", email: "marina.lopes@gmail.com", phone: "+55 11 97765-1290", document: null, emailOptOut: true, smsOptOut: false, createdAt: "2026-06-18T10:00:00Z" },
  { id: "cu_06", name: "Thiago Nascimento", email: "thiago.n@gmail.com", phone: "+55 31 99210-7781", document: "456.123.789-55", emailOptOut: false, smsOptOut: false, createdAt: "2026-07-09T10:00:00Z" },
  { id: "cu_07", name: "Beatriz Almeida", email: "bia.almeida@yahoo.com.br", phone: null, document: null, emailOptOut: false, smsOptOut: false, createdAt: "2026-08-14T10:00:00Z" },
  { id: "cu_08", name: "Lucas Ribeiro", email: "lucas.ribeiro@gmail.com", phone: "+55 11 98001-3345", document: null, emailOptOut: false, smsOptOut: false, createdAt: "2026-09-03T10:00:00Z" },
];

function charge(
  id: string,
  customerId: string,
  amountCents: number,
  dueDate: string,
  description: string,
  status: Charge["status"],
  extra: Partial<Charge> = {},
): Charge {
  const c = customers.find((x) => x.id === customerId)!;
  return {
    id,
    customerId,
    customerName: c.name,
    amountCents,
    dueDate,
    description,
    status,
    dunningPolicyId: "dp_01",
    externalReference: null,
    payLink: `https://pingo.app/pay/${id.replace("ch_", "tk")}Qm9vYXJ0aWNsZQ`,
    pixAttempt: 0,
    pixExpiresAt: null,
    paidAt: null,
    canceledAt: null,
    createdAt: "2026-09-25T13:00:00Z",
    ...extra,
  };
}

export const charges: Charge[] = [
  charge("ch_1042", "cu_01", 28900, "2026-10-10", "Mensalidade outubro · Pilates 3x", "PENDING", { pixAttempt: 1, pixExpiresAt: "2026-10-08T12:00:00Z", externalReference: "AUR-2026-10-018" }),
  charge("ch_1041", "cu_02", 18900, "2026-10-05", "Mensalidade outubro · Pilates 2x", "OVERDUE", { pixAttempt: 2 }),
  charge("ch_1040", "cu_03", 28900, "2026-10-05", "Mensalidade outubro · Pilates 3x", "PAID", { paidAt: "2026-10-04T15:22:00Z", pixAttempt: 1 }),
  charge("ch_1039", "cu_04", 45000, "2026-10-15", "Pacote 10 aulas avulsas", "PENDING"),
  charge("ch_1038", "cu_05", 18900, "2026-09-20", "Mensalidade setembro · Pilates 2x", "OVERDUE", { pixAttempt: 3 }),
  charge("ch_1037", "cu_06", 32000, "2026-10-01", "Avaliação postural + plano", "PAID", { paidAt: "2026-09-30T11:02:00Z", pixAttempt: 1 }),
  charge("ch_1036", "cu_07", 28900, "2026-09-28", "Mensalidade setembro · Pilates 3x", "CANCELED", { canceledAt: "2026-09-27T18:40:00Z" }),
  charge("ch_1035", "cu_08", 9900, "2026-10-20", "Aula experimental + matrícula", "PENDING"),
  charge("ch_1034", "cu_01", 28900, "2026-09-10", "Mensalidade setembro · Pilates 3x", "PAID", { paidAt: "2026-09-09T09:41:00Z", pixAttempt: 1 }),
  charge("ch_1033", "cu_06", 18900, "2026-08-30", "Mensalidade agosto · Pilates 2x", "OVERDUE", { pixAttempt: 4 }),
  charge("ch_1032", "cu_03", 28900, "2026-09-05", "Mensalidade setembro · Pilates 3x", "PAID", { paidAt: "2026-09-06T20:10:00Z", pixAttempt: 2 }),
  charge("ch_1031", "cu_02", 18900, "2026-09-05", "Mensalidade setembro · Pilates 2x", "PAID", { paidAt: "2026-09-12T14:18:00Z", pixAttempt: 2 }),
];

export const chargeHistory: Record<string, ChargeStatusHistory[]> = {
  ch_1041: [
    { id: "h1", fromStatus: null, toStatus: "PENDING", reason: "Cobrança criada por Ana Paula Rocha", occurredAt: "2026-09-25T13:00:00Z" },
    { id: "h2", fromStatus: "PENDING", toStatus: "OVERDUE", reason: "Job de vencimento (due_date < hoje)", occurredAt: "2026-10-06T03:00:00Z" },
  ],
  ch_1040: [
    { id: "h3", fromStatus: null, toStatus: "PENDING", reason: "Cobrança criada via API key · erp-integracao", occurredAt: "2026-09-25T13:00:00Z" },
    { id: "h4", fromStatus: "PENDING", toStatus: "PAID", reason: "Webhook payment_intent.succeeded · evt_3Q8…aK1", occurredAt: "2026-10-04T15:22:00Z" },
  ],
};

export const reminders: Record<string, ScheduledReminder[]> = {
  ch_1041: [
    { id: "re_1", offsetDays: -3, channel: "EMAIL", templateName: "Lembrete amigável", scheduledFor: "2026-10-02T12:00:00Z", status: "SENT" },
    { id: "re_2", offsetDays: 0, channel: "EMAIL", templateName: "Vence hoje", scheduledFor: "2026-10-05T12:00:00Z", status: "SENT" },
    { id: "re_3", offsetDays: 3, channel: "SMS", templateName: "Pix em aberto (SMS)", scheduledFor: "2026-10-08T12:00:00Z", status: "SCHEDULED" },
    { id: "re_4", offsetDays: 7, channel: "EMAIL", templateName: "Segundo aviso", scheduledFor: "2026-10-12T12:00:00Z", status: "SCHEDULED" },
  ],
};

export const notifications: Record<string, Notification[]> = {
  ch_1041: [
    {
      id: "no_2",
      reminderId: "re_2",
      channel: "EMAIL",
      recipient: "rafa.moura@outlook.com",
      status: "SENT",
      statusReason: null,
      attempts: 2,
      renderedSubject: "Sua mensalidade vence hoje",
      renderedBody:
        "Oi, Rafael! Passando para lembrar que a mensalidade de R$ 189,00 do Studio Aurora vence hoje (05 out).\n\nPague com Pix em poucos segundos: https://pingo.app/pay/tk1041Qm9v\n\nSe já pagou, pode ignorar esta mensagem.",
      sentAt: "2026-10-05T12:06:00Z",
      createdAt: "2026-10-05T12:00:00Z",
    },
    {
      id: "no_1",
      reminderId: "re_1",
      channel: "EMAIL",
      recipient: "rafa.moura@outlook.com",
      status: "SENT",
      statusReason: null,
      attempts: 1,
      renderedSubject: "Sua mensalidade vence em 3 dias",
      renderedBody:
        "Oi, Rafael! A mensalidade de R$ 189,00 do Studio Aurora vence em 05 out.\n\nQuando quiser, pague com Pix: https://pingo.app/pay/tk1041Qm9v",
      sentAt: "2026-10-02T12:00:00Z",
      createdAt: "2026-10-02T12:00:00Z",
    },
  ],
};

export const templates: MessageTemplate[] = [
  { id: "tp_01", name: "Lembrete amigável", channel: "EMAIL", subject: "Sua mensalidade vence em 3 dias", body: "Oi, {{customer_name}}! A mensalidade de {{amount}} do {{tenant_name}} vence em {{due_date}}.\n\nQuando quiser, pague com Pix: {{pay_link}}", updatedAt: "2026-09-20T10:00:00Z" },
  { id: "tp_02", name: "Vence hoje", channel: "EMAIL", subject: "Sua mensalidade vence hoje", body: "Oi, {{customer_name}}! Passando para lembrar que a mensalidade de {{amount}} do {{tenant_name}} vence hoje ({{due_date}}).\n\nPague com Pix em poucos segundos: {{pay_link}}\n\nSe já pagou, pode ignorar esta mensagem.", updatedAt: "2026-09-20T10:00:00Z" },
  { id: "tp_03", name: "Pix em aberto (SMS)", channel: "SMS", subject: null, body: "{{tenant_name}}: oi {{customer_name}}, sua mensalidade de {{amount}} segue em aberto. Pix: {{pay_link}}", updatedAt: "2026-09-21T10:00:00Z" },
  { id: "tp_04", name: "Segundo aviso", channel: "EMAIL", subject: "Sua mensalidade continua em aberto", body: "Oi, {{customer_name}}. A mensalidade de {{amount}} com vencimento em {{due_date}} ainda consta em aberto.\n\nSe precisar de ajuda ou quiser combinar outra data, é só responder este e-mail.\n\nPix: {{pay_link}}", updatedAt: "2026-09-22T10:00:00Z" },
];

export const dunningPolicies: DunningPolicy[] = [
  {
    id: "dp_01",
    name: "Mensalidades",
    isDefault: true,
    updatedAt: "2026-09-22T10:00:00Z",
    steps: [
      { id: "st_1", offsetDays: -3, channel: "EMAIL", templateId: "tp_01" },
      { id: "st_2", offsetDays: 0, channel: "EMAIL", templateId: "tp_02" },
      { id: "st_3", offsetDays: 3, channel: "SMS", templateId: "tp_03" },
      { id: "st_4", offsetDays: 7, channel: "EMAIL", templateId: "tp_04" },
    ],
  },
  {
    id: "dp_02",
    name: "Avulsas e pacotes",
    isDefault: false,
    updatedAt: "2026-09-12T10:00:00Z",
    steps: [
      { id: "st_5", offsetDays: -1, channel: "EMAIL", templateId: "tp_01" },
      { id: "st_6", offsetDays: 2, channel: "EMAIL", templateId: "tp_04" },
    ],
  },
];

export const apiKeys: ApiKey[] = [
  { id: "ak_01", name: "erp-integracao", prefix: "pg_live_7Hc2", createdAt: "2026-08-02T10:00:00Z", lastUsedAt: "2026-10-07T11:58:00Z", revokedAt: null },
  { id: "ak_02", name: "planilha-zapier", prefix: "pg_live_Qa91", createdAt: "2026-06-10T10:00:00Z", lastUsedAt: "2026-09-29T08:12:00Z", revokedAt: null },
  { id: "ak_03", name: "teste-antigo", prefix: "pg_live_b0X4", createdAt: "2026-04-01T10:00:00Z", lastUsedAt: "2026-05-02T10:00:00Z", revokedAt: "2026-06-01T10:00:00Z" },
];

export const pspAccount: PspAccount = {
  id: "psp_01",
  provider: "STRIPE",
  environment: "SANDBOX",
  credentialRef: "env:STRIPE_SECRET_KEY",
  webhookSecretRef: "env:STRIPE_WEBHOOK_SECRET",
  webhookSecretPreviousRef: "env:STRIPE_WEBHOOK_SECRET_OLD",
  externalAccountId: null,
  webhookUrl: "https://api.pingo.app/webhooks/stripe/psp_01",
  lastEventAt: "2026-10-07T11:42:00Z",
};

export const dashboard: DashboardSummary = {
  periodLabel: "Últimos 30 dias",
  billedCents: 1_284_300,
  receivedCents: 1_012_800,
  overdueCents: 189_400,
  recoveryRate: 0.787,
  aging: [
    { bucket: "0–7", cents: 94_500, count: 5 },
    { bucket: "8–30", cents: 56_700, count: 3 },
    { bucket: "30+", cents: 38_200, count: 2 },
  ],
  daily: Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 8, 8 + i));
    const wave = Math.sin(i / 3.2) * 0.5 + 0.5;
    const spike = i % 7 === 2 ? 1.35 : 1;
    const billed = Math.round((22_000 + wave * 38_000) * spike);
    const received = Math.round(billed * (0.62 + ((i * 37) % 30) / 100));
    return { date: d.toISOString().slice(0, 10), billedCents: billed, receivedCents: received };
  }),
};

export const auditLog: AuditEntry[] = [
  { id: "au_9", actorType: "USER", actorName: "Ana Paula Rocha", action: "CHARGE_CANCELED", resourceType: "charge", resourceLabel: "ch_1036 · Beatriz Almeida", ipAddress: "189.40.12.77", createdAt: "2026-10-07T13:41:00Z" },
  { id: "au_8", actorType: "USER", actorName: "Mauricio Corleone", action: "DUNNING_POLICY_UPDATED", resourceType: "dunning_policy", resourceLabel: "Mensalidades", ipAddress: "177.92.4.10", createdAt: "2026-10-07T12:10:00Z" },
  { id: "au_7", actorType: "USER", actorName: "Mauricio Corleone", action: "API_KEY_CREATED", resourceType: "api_key", resourceLabel: "erp-integracao", ipAddress: "177.92.4.10", createdAt: "2026-10-06T18:02:00Z" },
  { id: "au_6", actorType: "USER", actorName: "Bruno Takeda", action: "PASSWORD_RESET_COMPLETED", resourceType: "user", resourceLabel: "bruno@studioaurora.com.br", ipAddress: "200.150.3.21", createdAt: "2026-10-05T09:15:00Z" },
  { id: "au_5", actorType: "USER", actorName: "Mauricio Corleone", action: "USER_ROLE_CHANGED", resourceType: "user", resourceLabel: "Ana Paula Rocha · Operador", ipAddress: "177.92.4.10", createdAt: "2026-10-03T16:44:00Z" },
  { id: "au_4", actorType: "USER", actorName: "Mauricio Corleone", action: "PSP_ACCOUNT_UPDATED", resourceType: "psp_account", resourceLabel: "Stripe · rotação do segredo do webhook", ipAddress: "177.92.4.10", createdAt: "2026-10-01T11:20:00Z" },
  { id: "au_3", actorType: "API_KEY", actorName: "erp-integracao", action: "CHARGE_CANCELED", resourceType: "charge", resourceLabel: "ch_1029 · Lucas Ribeiro", ipAddress: "34.95.140.8", createdAt: "2026-09-29T08:12:00Z" },
  { id: "au_2", actorType: "USER", actorName: "Mauricio Corleone", action: "USER_INVITED", resourceType: "user", resourceLabel: "bruno@studioaurora.com.br", ipAddress: "177.92.4.10", createdAt: "2026-09-20T10:05:00Z" },
  { id: "au_1", actorType: "USER", actorName: "Mauricio Corleone", action: "API_KEY_REVOKED", resourceType: "api_key", resourceLabel: "teste-antigo", ipAddress: "177.92.4.10", createdAt: "2026-06-01T10:00:00Z" },
];
