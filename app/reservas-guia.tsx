import React from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function ReservasGuia() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#EAF3FF" }}>
      <Text style={{ color: "#173B6B", fontSize: 30, fontWeight: "900", textAlign: "center", marginBottom: 20 }}>
        Mis reservas
      </Text>

      <View style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 22, padding: 20 }}>
        <Text style={{ color: "#173B6B", fontSize: 18, fontWeight: "800", marginBottom: 10 }}>
          Reservas del guía
        </Text>

        <Text style={{ color: "#173B6B", fontSize: 16 }}>
          Todavía no hay reservas pagadas para este guía.
        </Text>
      </View>

      <Pressable
        onPress={() => router.replace("/perfil-guia")}
        style={{ backgroundColor: "#173B6B", padding: 16, borderRadius: 16, marginTop: 24 }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", textAlign: "center", fontSize: 16 }}>
          Volver al perfil guía
        </Text>
      </Pressable>
    </View>
  );
}