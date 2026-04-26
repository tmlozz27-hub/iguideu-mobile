import React, { useEffect, useState } from "react";
import { Tabs, usePathname, useRouter } from "expo-router";
import { apiGet } from "@/config/api";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<"traveler" | "guide" | null>(null);

  useEffect(() => {
    let active = true;

    const loadRole = async () => {
      try {
        const data = await apiGet("/api/auth/me");
        const userRole = data?.user?.role === "guide" ? "guide" : "traveler";

        if (active) {
          setRole(userRole);
        }
      } catch {
        if (active) {
          setRole("traveler");
        }
      }
    };

    loadRole();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (role !== "guide") return;

    const allowed =
      pathname === "/perfil" || pathname === "/(tabs)/perfil";

    if (!allowed) {
      router.replace("/(tabs)/perfil");
    }
  }, [pathname, role, router]);

  if (!role) return null;

  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      position: "absolute" as const,
      backgroundColor: "transparent",
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      height: 74
    },
    tabBarBackground: () => null
  };

  if (role === "guide") {
    return (
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="guias" options={{ href: null }} />
        <Tabs.Screen name="reservas" options={{ href: null }} />
        <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
      </Tabs>
    );
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="guias" options={{ title: "Guías" }} />
      <Tabs.Screen name="reservas" options={{ title: "Reservas" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
