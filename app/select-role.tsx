import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SelectRoleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f9fb3" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>

        <Text style={{ color: "#ffffff", fontSize: 42, fontWeight: "800", marginBottom: 20 }}>
          I GUIDE U
        </Text>

        <View style={{ width: "100%", backgroundColor: "#ffffff", borderRadius: 28, padding: 22, gap: 16 }}>

          <Text style={{ fontSize: 28, fontWeight: "800", color: "#111827", textAlign: "center" }}>
            {"Eleg\u00ED tu perfil"}
          </Text>

          <Text style={{ color: "#374151", fontSize: 16, textAlign: "center" }}>
            {"Seleccion\u00E1 c\u00F3mo quer\u00E9s usar I GUIDE U."}
          </Text>

          <Pressable
            onPress={() => router.push("/register?role=traveler")}
            style={{ backgroundColor: "#f6c744", borderRadius: 14, paddingVertical: 18, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
              Soy viajero
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/register?role=guide")}
            style={{ backgroundColor: "#1f3b63", borderRadius: 14, paddingVertical: 18, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
              {"Soy gu\u00EDa"}
            </Text>
          </Pressable>

          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: "#1f3b63", fontSize: 18 }}>
              {"\u00BFYa tienes cuenta?"}
            </Text>

            <Pressable onPress={() => router.replace("/login")}>
              <Text style={{ color: "#0f3f78", fontWeight: "800", fontSize: 18 }}>
                {"Iniciar sesi\u00F3n"}
              </Text>
            </Pressable>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}
