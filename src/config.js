// src/config.js
// COMPAT: si algún import viejo apunta acá, no puede romper el base URL.
const clean = (v) => (v || "").trim().replace(/\/+$/, "");

export const API_BASE =
  clean(process.env.EXPO_PUBLIC_API_URL) ||
  clean(process.env.EXPO_PUBLIC_API_BASE) ||
  "https://dev-api.i-guide-u.com";

export const TRAVELER_EMAIL =
  (process.env.EXPO_PUBLIC_TRAVELER_EMAIL || "").trim() ||
  "test+frontend@iguideu.com";
