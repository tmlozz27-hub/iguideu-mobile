import { Redirect } from "expo-router";

export default function TabIndex() {
  // ✅ Evita que Expo Router intente abrir rutas viejas como /(tabs)/guia
  return <Redirect href="/(tabs)/guias" />;
}
