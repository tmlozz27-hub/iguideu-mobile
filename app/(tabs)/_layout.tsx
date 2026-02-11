import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Ajustá estos nombres a tus archivos reales dentro de app/(tabs)/ */}
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="guias" options={{ title: "Guías" }} />
      <Tabs.Screen name="reservas" options={{ title: "Reservas" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  );
}

