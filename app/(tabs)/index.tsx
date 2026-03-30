import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function HomeTabScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#A9C9F5" }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 44,
        paddingBottom: 40,
        minHeight: "100%",
      }}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text
              style={{
                position: "absolute",
                left: 0,
                top: 6,
                fontSize: 28,
              }}
            >
              📍
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 44,
                fontWeight: "800",
                textAlign: "center",
                letterSpacing: 2,
              }}
            >
              I GUIDE U
            </Text>
          </View>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: "800",
              textAlign: "center",
              lineHeight: 42,
              marginTop: 80,
              paddingHorizontal: 12,
              textShadowColor: "rgba(0,0,0,0.12)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            Hola,{"\n"}¿a dónde querés{"\n"}viajar hoy?
          </Text>
        </View>

        <View style={{ marginTop: 80, gap: 18 }}>
          <Pressable
            onPress={() => router.push("/guias")}
            style={{
              backgroundColor: "#4A8FDF",
              paddingVertical: 24,
              paddingHorizontal: 20,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 28,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Explorar Guías
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/buscar-pais")}
            style={{
              backgroundColor: "#4A8FDF",
              paddingVertical: 22,
              paddingHorizontal: 20,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Guías por país
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/guias-cercanos")}
            style={{
              backgroundColor: "#4A8FDF",
              paddingVertical: 22,
              paddingHorizontal: 20,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Guías cercanos
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/reservas")}
            style={{
              backgroundColor: "#4A8FDF",
              paddingVertical: 22,
              paddingHorizontal: 20,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Mis reservas
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/perfil")}
            style={{
              backgroundColor: "#4A8FDF",
              paddingVertical: 22,
              paddingHorizontal: 20,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Perfil
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}