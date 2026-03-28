import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ROLE_KEY = "iguideu_pending_role";

export default function SelectRoleScreen() {
  const router = useRouter();

  const chooseRole = async (role: "traveler" | "guide") => {
    await AsyncStorage.setItem(ROLE_KEY, role);
    router.push("/register");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f9fb3" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 40
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 42,
            fontWeight: "800",
            marginBottom: 40,
            marginTop: 10
          }}
        >
          I GUIDE U
        </Text>

        <View
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: 28,
            padding: 22,
            gap: 18
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827" }}>
            Elegí tu perfil
          </Text>

          <Text style={{ fontSize: 16, color: "#374151" }}>
            Seleccioná cómo querés usar I GUIDE U.
          </Text>

          <Pressable
            onPress={() => chooseRole("traveler")}
            style={{
              backgroundColor: "#f6c744",
              borderRadius: 14,
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
              Soy viajero
            </Text>
          </Pressable>

          <Pressable
            onPress={() => chooseRole("guide")}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 14,
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff"
            }}
          >
            <Text style={{ color: "#374151", fontSize: 20, fontWeight: "700" }}>
              Soy guía
            </Text>
          </Pressable>

          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: "#1f3b63", fontSize: 18 }}>
              ¿Ya tienes cuenta?
            </Text>

            <Pressable onPress={() => router.push("/login")}>
              <Text
                style={{
                  color: "#0f3f78",
                  fontSize: 22,
                  fontWeight: "800",
                  marginTop: 6
                }}
              >
                Iniciar sesión
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

