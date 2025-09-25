export type BackendCategory =
  | "common_incoming"
  | "common_outgoing"
  | "confidential_incoming"
  | "confidential_outgoing"
  | "signals_incoming"
  | "signals_outgoing";

export function mapFrontendTypeToBackendCategory(type: string): BackendCategory | null {
  switch (type) {
    case "koina-incoming":
      return "common_incoming";
    case "koina-outgoing":
      return "common_outgoing";
    case "secret-incoming":
      return "confidential_incoming";
    case "secret-outgoing":
      return "confidential_outgoing";
    case "signals-incoming":
      return "signals_incoming";
    case "signals-outgoing":
      return "signals_outgoing";
    default:
      return null;
  }
}

const BASE_URL = "http://127.0.0.1:8733";

export interface RegistrationCreate {
  issuer: string;
  referenceNumber: string;
  subject: string;
  recipient?: string;
  offices?: string[];
  entryDate?: string; // YYYY-MM-DD
}

export interface Registration {
  id: number;
  category: BackendCategory;
  issuer: string;
  referenceNumber: string;
  subject: string;
  recipient?: string | null;
  offices?: string[] | null;
  protocolNumber: number;
  draftNumber?: number | null;
  entryDate: string;
  createdAt: string;
}

export async function createRegistration(category: BackendCategory, payload: RegistrationCreate): Promise<Registration> {
  const res = await fetch(`${BASE_URL}/registrations/${category}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function listRegistrations(month: string, category?: BackendCategory) {
  const url = new URL(`${BASE_URL}/registrations`);
  url.searchParams.set("month", month);
  url.searchParams.set("page", "1");
  if (category) url.searchParams.set("category", category);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  return res.json();
}

export async function getOffices(): Promise<{ code: string; label: string }[]> {
  const res = await fetch(`${BASE_URL}/meta/offices`);
  if (!res.ok) throw new Error(`Offices failed: ${res.status}`);
  return res.json();
}
