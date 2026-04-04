import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function SelectRoleScreen() {
  const router = useRouter();

  const goTraveler = () => {
    router.push("/perfil-viajero");
  };

  const goGuide = () => {
    router.push("/perfil-guia");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#A9C9F5" }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
        flexGrow: 1,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 40,
            letterSpacing: 1,
          }}
        >
          I GUIDE U
        </Text>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 36,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          Elegí tu perfil
        </Text>

        <View style={{ gap: 20 }}>
          <Pressable
            onPress={goTraveler}
            style={{
              backgroundColor: "#4A8FDF",
              paddingVertical: 24,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Viajero
            </Text>
          </Pressable>

          <Pressable
            onPress={goGuide}
            style={{
              backgroundColor: "rgba(74,143,223,0.65)",
              paddingVertical: 24,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Guía
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}