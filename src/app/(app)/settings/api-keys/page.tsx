import { listApiKeys } from "@/lib/api";
import { ApiKeysPanel } from "./api-keys-panel";

export const metadata = { title: "API keys" };

export default function ApiKeysPage() {
  return <ApiKeysPanel keys={listApiKeys()} />;
}
