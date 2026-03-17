import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 24
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#0f172a" }}>
          I GUIDE U
        </Text>

        <Text style={{ marginTop: 8, fontSize: 16, color: "#475569" }}>
          Elegí cómo querés encontrar tu guía.
        </Text>

        <Pressable
          onPress={() => router.push("/buscar-pais")}
          style={{
            marginTop: 24,
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 20,
            padding: 20
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a" }}>
            Buscar guías por país
          </Text>
          <Text style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
            Explorá guías disponibles según el país que elijas.
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/guias-cercanos")}
          style={{
            marginTop: 14,
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 20,
            padding: 20
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a" }}>
            Guías cercanos
          </Text>
          <Text style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
            Encontrá guías cerca de tu ubicación actual.
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/perfil")}
          style={{
            marginTop: 14,
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 20,
            padding: 20
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a" }}>
            Mi perfil
          </Text>
          <Text style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
            Revisá tu cuenta, reservas y opciones legales.
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}