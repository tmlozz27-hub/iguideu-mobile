const ENV_BASE = (process.env.EXPO_PUBLIC_API_URL || "").trim();

const BASE = (ENV_BASE || "http://192.168.0.4:4020").replace(/\/+$/, "");

type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
};

async function http<T>(path: string, opts: HttpOptions = {}): Promise<T> {
  const url = `${BASE}${path}`;

  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    body: opts.body,
  });

  const text = await res.text();

  if (!res.ok) {
    const msg = `NON_JSON_RESPONSE HTTP ${res.status} ${path} :: ${text}`;
    throw new Error(msg);
  }

  if (!text) return null as unknown as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    const msg = `NON_JSON_RESPONSE HTTP ${res.status} ${path} :: ${text}`;
    throw new Error(msg);
  }
}

export async function getGuides(): Promise<any[]> {
  const data = await http<any>("/api/guides", { method: "GET" });
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.guides)) return data.guides;
  return [];
}

export async function createBooking(payload: {
  travelerEmail: string;
  guideId: string;
  date: string;
  hours: number;
}): Promise<any> {
  return await http<any>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createPaymentIntent(payload: { bookingId: string }): Promise<any> {
  return await http<any>("/api/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

const api = {
  BASE,
  getGuides,
  createBooking,
  createPaymentIntent,
};

export default api;
