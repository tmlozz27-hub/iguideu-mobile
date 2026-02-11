import { useEffect } from "react";
import { View, Text } from "react-native";

/**
 * App.tsx SAFE WRAPPER
 * Evita crash por "Unable to activate keep awake"
 * No usa expo-keep-awake
 */

export default function App() {
  useEffect(() => {
    try {
      const EU: any = (globalThis as any).ErrorUtils;
      if (EU && typeof EU.setGlobalHandler === "function") {
        const prev =
          typeof EU.getGlobalHandler === "function"
            ? EU.getGlobalHandler()
            : null;

        EU.setGlobalHandler((err: any, isFatal: boolean) => {
          const msg = String(err?.message || err || "");
          if (msg.includes("Unable to activate keep awake")) {
            // ignorar error de Expo / Android
            return;
          }
          if (prev) return prev(err, isFatal);
          throw err;
        });
      }
    } catch {}
  }, []);

  // App.tsx no renderiza nada (expo-router toma control)
  return <View />;
}
