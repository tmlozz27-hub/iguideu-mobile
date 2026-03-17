import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function ChatTestScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#0f172a" }}>
          Chat
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            color: "#475569",
            textAlign: "center"
          }}
        >
          Pantalla temporal desactivada para no ensuciar el flujo principal.
        </Text>
      </View>
    </SafeAreaView>
  );
}