export const API_BASE_URL = "http://192.168.0.4:4020";

export function apiUrl(path: string) {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return API_BASE_URL + path;
  return API_BASE_URL + "/" + path;
}

async function apiFetch<T>(method: string, path: string, body?: any): Promise<T> {
  const url = apiUrl(path);
  const timeoutMs = 20000;

  const fetchPromise = fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs)
  );

  const res = (await Promise.race([fetchPromise, timeoutPromise])) as Response;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export function apiGet<T = any>(path: string): Promise<T> {
  return apiFetch<T>("GET", path);
}

export function apiPost<T = any>(path: string, body?: any): Promise<T> {
  return apiFetch<T>("POST", path, body);
}

export function apiPut<T = any>(path: string, body?: any): Promise<T> {
  return apiFetch<T>("PUT", path, body);
}

export function apiDel<T = any>(path: string): Promise<T> {
  return apiFetch<T>("DELETE", path);
}