import React, { useEffect, useState } from "react";
import { Tabs, usePathname, useRouter } from "expo-router";
import { apiGet } from "@/config/api";
import { Ionicons } from "@expo/vector-icons";

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

  useEffect(() => {
    if (role !== "guide") return;

    const allowed = pathname === "/perfil" || pathname === "/(tabs)/perfil";

    if (!allowed) {
      router.replace("/(tabs)/perfil");
    }
  }, [pathname, role, router]);

  if (!role) return null;

  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      position: "absolute" as const,
      left: 14,
      right: 14,
      bottom: 30, // 🔥 SUBE EL TAB (ANTES ESTABA MUY ABAJO)
      height: 60,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.9)",
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      paddingBottom: 6,
      paddingTop: 6
    },
    tabBarActiveTintColor: "#15539A",
    tabBarInactiveTintColor: "#15539A",
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "800"
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
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: TabIcon("person")
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: TabIcon("home")
        }}
      />
      <Tabs.Screen
        name="guias"
        options={{
          title: "Guías",
          tabBarIcon: TabIcon("compass")
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: "Reservas",
          tabBarIcon: TabIcon("calendar")
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: TabIcon("person")
        }}
      />
    </Tabs>
  );
}