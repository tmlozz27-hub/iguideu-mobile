// keepAwakeSafe.ts
// Anti-crash total para Expo Go / Android: si KeepAwake falla, NO debe tumbar la app.

let _loaded = false;
let _activate: null | (() => void | Promise<void>) = null;
let _deactivate: null | (() => void | Promise<void>) = null;

function loadKeepAwakeOnce() {
  if (_loaded) return;
  _loaded = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("expo-keep-awake");

    if (typeof mod.activateKeepAwake === "function") _activate = mod.activateKeepAwake;
    if (typeof mod.deactivateKeepAwake === "function") _deactivate = mod.deactivateKeepAwake;

    // Algunas versiones exportan default o funciones distintas; igual acá NO forzamos nada.
  } catch {
    _activate = null;
    _deactivate = null;
  }
}

async function safeCall(fn: null | (() => void | Promise<void>)) {
  if (!fn) return;
  try {
    const r = fn();
    if (r && typeof (r as any).then === "function") await r;
  } catch {
    // IMPORTANTÍSIMO: JAMÁS lanzar error acá.
  }
}

/**
 * Activa keep-awake SOLO si existe y SOLO si no rompe.
 * Si Expo Go no puede activarlo, se ignora.
 */
export async function keepAwakeOn() {
  loadKeepAwakeOnce();
  await safeCall(_activate);
}

/**
 * Desactiva keep-awake SOLO si existe y SOLO si no rompe.
 */
export async function keepAwakeOff() {
  loadKeepAwakeOnce();
  await safeCall(_deactivate);
}
