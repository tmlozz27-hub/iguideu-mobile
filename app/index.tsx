import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "iguideu_token";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const token = await AsyncStorage.getItem(TOKEN_KEY);

        if (!active) return;

        if (token) {
          router.replace("/(tabs)");
          return;
        }

        router.replace("/select-role");
      } catch {
        if (!active) return;
        router.replace("/select-role");
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f9fb3",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: 54,
          fontWeight: "800",
          letterSpacing: 1,
        }}
      >
        I GUIDE U
      </Text>

      <Text
        style={{
          color: "#dbeafe",
          fontSize: 18,
          marginTop: 18,
          textAlign: "center",
        }}
      >
        Guías personales para viajeros en todo el mundo
      </Text>
    </View>
  );
}
