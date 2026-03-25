import React, { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "iguideu_token";

export default function TabsLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);

        if (!token) {
          router.replace("/login");
          return;
        }
      } catch {
        router.replace("/login");
        return;
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="guias" options={{ title: "Guías" }} />
      <Tabs.Screen name="reservas" options={{ title: "Reservas" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  );
}