import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/login");
    }, 1400);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0d4d92",
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