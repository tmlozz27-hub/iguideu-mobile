// config/devKeepAwake.ts
// Activa "keep awake" SOLO en desarrollo (DEV).
// No afecta builds de producción.

export function devKeepAwake() {
  if (!__DEV__) return;

  // import dinámico para que sea inocuo fuera de DEV
  import("expo-keep-awake")
    .then((m) => {
      try {
        // Mantiene la app despierta mientras estás desarrollando
        m.activateKeepAwakeAsync("IGUIDEU_DEV");
      } catch {}
    })
    .catch(() => {});
}
