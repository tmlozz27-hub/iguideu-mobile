export const API_BASE = (process.env.EXPO_PUBLIC_API_BASE || "").replace(/\/+$/, "");
export const STRIPE_MODE = process.env.EXPO_PUBLIC_STRIPE_MODE || "test";

async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${normalizedPath}`;

  console.log("API_BASE_URL_RUNTIME", API_BASE);
  console.log("API_FETCH", options.method || "GET", url);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.error || data.message)) ||
      `HTTP ${response.status}`;
    throw new Error(String(message));
  }

  return data;
}

export async function apiGet(path: string) {
  return apiFetch(path, { method: "GET" });
}

export async function apiPost(path: string, body?: any) {
  return apiFetch(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut(path: string, body?: any) {
  return apiFetch(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch(path: string, body?: any) {
  return apiFetch(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete(path: string) {
  return apiFetch(path, { method: "DELETE" });
}