import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function HomeTabScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#15539A" }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
    >
      <View style={{ backgroundColor: "#2F5F93", borderRadius: 24, padding: 18 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "800" }}>
          I GUIDE U
        </Text>

        <Text style={{ color: "#FFFFFF", marginTop: 10, fontSize: 16 }}>
          Elegí qué querés hacer
        </Text>

        <Pressable
          onPress={() => router.push("/buscar-pais")}
          style={{
            marginTop: 18,
            backgroundColor: "#27D3BE",
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800", textAlign: "center" }}>
            Buscar guías por país
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/guias-cercanos")}
          style={{
            marginTop: 14,
            backgroundColor: "#27D3BE",
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800", textAlign: "center" }}>
            Guías cercanos
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/guias")}
          style={{
            marginTop: 14,
            backgroundColor: "#1E88E5",
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800", textAlign: "center" }}>
            Ver guías
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/reservas")}
          style={{
            marginTop: 14,
            backgroundColor: "#1E88E5",
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800", textAlign: "center" }}>
            Mis reservas
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/perfil")}
          style={{
            marginTop: 14,
            backgroundColor: "#1E88E5",
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800", textAlign: "center" }}>
            Mi perfil
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}