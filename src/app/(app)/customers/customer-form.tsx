"use client";

import { useState } from "react";
import { Button, Card, CardHeader, Field, Input } from "@/components/ui";
import { Switch } from "@/components/controls";
import type { Customer } from "@/lib/types";

export function CustomerForm({ customer }: { customer?: Customer }) {
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [emailOptOut, setEmailOptOut] = useState(customer?.emailOptOut ?? false);
  const [smsOptOut, setSmsOptOut] = useState(customer?.smsOptOut ?? false);
  const missingContact = !email.trim() && !phone.trim();

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <Card>
        <CardHeader title="Dados" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome completo" className="sm:col-span-2">
            <Input defaultValue={customer?.name} placeholder="Ex.: Camila Ferreira" />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@email.com" />
          </Field>
          <Field label="Celular">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 11 90000-0000" />
          </Field>
          <Field label="CPF ou CNPJ" hint="Opcional, único entre clientes ativos.">
            <Input defaultValue={customer?.document ?? ""} placeholder="000.000.000-00" />
          </Field>
        </div>
        {missingContact && (
          <p className="mt-4 rounded-xl bg-amber-soft px-4 py-2.5 text-[13px] text-amber">Informe pelo menos um contato: e-mail ou celular.</p>
        )}
      </Card>

      <Card>
        <CardHeader title="Lembretes" subtitle="O cliente também pode se descadastrar pelo link no e-mail." />
        <div className="divide-y divide-line [&>*]:py-3 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
          <div>
            <Switch
              label="Receber por e-mail"
              description={email || "Sem e-mail cadastrado"}
              checked={!emailOptOut && !!email}
              disabled={!email}
              onCheckedChange={(v) => setEmailOptOut(!v)}
            />
          </div>
          <div>
            <Switch
              label="Receber por SMS"
              description={phone || "Sem celular cadastrado"}
              checked={!smsOptOut && !!phone}
              disabled={!phone}
              onCheckedChange={(v) => setSmsOptOut(!v)}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-between gap-2">
        {customer ? (
          <Button variant="danger" type="button">
            Excluir cliente
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button variant="ghost" href="/customers">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={missingContact}>
            {customer ? "Salvar alterações" : "Adicionar cliente"}
          </Button>
        </div>
      </div>
    </form>
  );
}
