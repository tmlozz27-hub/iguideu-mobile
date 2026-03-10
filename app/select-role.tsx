import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function SelectRoleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d3f77" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: "center",
          gap: 22,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 42,
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          Elegí tu perfil
        </Text>

        <Text
          style={{
            color: "#dbeafe",
            fontSize: 20,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Seleccioná cómo querés usar I GUIDE U
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 22,
            paddingVertical: 24,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ color: "#0d3f77", fontSize: 28, fontWeight: "800", textAlign: "center" }}>
            Turista / Viajero
          </Text>
          <Text style={{ color: "#375a7f", fontSize: 18, textAlign: "center", marginTop: 8 }}>
            Buscar guías, reservar, pagar y viajar
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 22,
            paddingVertical: 24,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ color: "#0d3f77", fontSize: 28, fontWeight: "800", textAlign: "center" }}>
            Guía
          </Text>
          <Text style={{ color: "#375a7f", fontSize: 18, textAlign: "center", marginTop: 8 }}>
            Ofrecer servicios, crear perfil y recibir reservas
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text
            style={{
              color: "#ffffff",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "700",
              marginTop: 10,
            }}
          >
            Volver
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}