import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { apiPost } from "@/config/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    const emailClean = String(email || "").trim().toLowerCase();

    if (!emailClean) {
      Alert.alert("Error", "Ingresá tu email.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/forgot-password", {
        email: emailClean,
      });

      if (data?.ok && data?.token) {
        Alert.alert(
          "OK",
          "Token generado correctamente. Continuá con la nueva contraseña.",
          [
            {
              text: "Seguir",
              onPress: () => router.push("/reset-password"),
            },
          ]
        );
        return;
      }

      if (data?.ok) {
        Alert.alert("OK", "Si el email existe, enviamos instrucciones para recuperar la contraseña.");
        return;
      }

      const message = String(data?.message || "");
      Alert.alert("Aviso", message || "No se pudo procesar la recuperación.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo conectar al backend.";
      Alert.alert("Aviso", message || "No se pudo procesar la recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f9fb3" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              paddingHorizontal: 24,
              paddingTop: 40,
              paddingBottom: 24,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 42,
                fontWeight: "800",
                marginBottom: 40,
                marginTop: 10,
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
                gap: 16,
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827" }}>
                Recuperar contraseña
              </Text>

              <Text style={{ color: "#374151", fontSize: 16 }}>
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
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 18,
                  color: "#111827",
                  backgroundColor: "#ffffff",
                }}
              />

              <Pressable
                onPress={handleRecover}
                disabled={loading}
                style={{
                  backgroundColor: "#f6c744",
                  borderRadius: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
                  {loading ? "Procesando..." : "Continuar"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.replace("/login")}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: "#1f3b63", fontSize: 16, fontWeight: "700" }}>
                  Volver al login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}