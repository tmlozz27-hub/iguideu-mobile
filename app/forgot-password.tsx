import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { apiPost } from "../config/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const emailClean = String(email || "").trim().toLowerCase();

    if (!emailClean) {
      Alert.alert("Error", "Ingresá tu email.");
      return;
    }

    try {
      setLoading(true);

      await apiPost("/api/auth/forgot-password", {
        email: emailClean
      });

      Alert.alert("OK", "Si el email existe, enviamos instrucciones para recuperar la contraseña.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      Alert.alert("Aviso", message || "Pantalla lista. Falta conectar el endpoint de recuperación en backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, padding: 24, gap: 20 }}>
            <Pressable onPress={() => router.back()}>
              <Text style={{ color: "#1f3b63", fontSize: 16, fontWeight: "700" }}>
                Volver
              </Text>
            </Pressable>

            <Text style={{ fontSize: 34, fontWeight: "800", color: "#111827" }}>
              Recuperar contraseña
            </Text>

            <Text style={{ fontSize: 18, color: "#4b5563", lineHeight: 28 }}>
              Ingresá tu email y te enviaremos instrucciones para recuperar el acceso.
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 18,
                color: "#111827",
                backgroundColor: "#ffffff"
              }}
            />

            <Pressable
              onPress={handleSend}
              disabled={loading}
              style={{
                backgroundColor: "#0f9fb3",
                borderRadius: 16,
                paddingVertical: 18,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.7 : 1
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "800" }}>
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}