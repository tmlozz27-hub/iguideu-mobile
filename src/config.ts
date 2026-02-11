// config/api.ts
// FUENTE ÚNICA de API para toda la app (NO duplicar, NO usar otros config)

export const API_BASE = "https://iguideu23-local.i-guide-u.com";

export function apiUrl(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return `${API_BASE}${path}`;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const text = await res.text();

  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `NON_JSON_RESPONSE HTTP ${res.status} ${path} :: ${text.slice(0, 200)}`
      );
    }
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      `HTTP ${res.status} ${path}`;
    throw new Error(msg);
  }

  return data;
}

export async function getGuides() {
  return apiFetch("/api/guides");
}

export async function getBookings(email: string) {
  if (!email) return [];
  return apiFetch(`/api/bookings?email=${encodeURIComponent(email)}`);
}

export async function createBooking(input: {
  travelerEmail: string;
  guideId: string;
  date: string;
  hours: number;
}) {
  return apiFetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createPaymentIntent(bookingId: string) {
  return apiFetch("/api/payments/create-intent", {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}
