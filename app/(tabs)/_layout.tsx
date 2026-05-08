import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { apiGet } from "@/config/api";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const [role, setRole] = useState<"traveler" | "guide" | null>(null);

  useEffect(() => {
    let active = true;

    const loadRole = async () => {
      try {
        const data = await apiGet("/api/auth/me");
        const userRole = data?.user?.role === "guide" ? "guide" : "traveler";

        if (active) setRole(userRole);
      } catch {
        if (active) setRole("traveler");
      }
    };

    loadRole();

    return () => {
      active = false;
    };
  }, []);

  if (!role) return null;

  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      display: "none" as const
    }
  };

  const TabIcon = (name: any) => ({ color, size }: any) =>
    <Ionicons name={name} size={size} color={color} />;

  if (role === "guide") {
    return (
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="guias" options={{ href: null }} />
        <Tabs.Screen name="reservas" options={{ href: null }} />
        <Tabs.Screen name="perfil" options={{ href: null }} />
      </Tabs>
    );
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: TabIcon("home") }} />
      <Tabs.Screen name="guias" options={{ title: "Guías", tabBarIcon: TabIcon("compass") }} />
      <Tabs.Screen name="reservas" options={{ title: "Reservas", tabBarIcon: TabIcon("calendar") }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: TabIcon("person") }} />
    </Tabs>
  );
}