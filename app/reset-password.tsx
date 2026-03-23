import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiPost } from "../config/api";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [token, setToken] = useState(String(params.token || ""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const tokenClean = String(token || "").trim();
    const passwordClean = String(newPassword || "").trim();
    const confirmClean = String(confirmPassword || "").trim();

    if (!tokenClean) {
      Alert.alert("Error", "Ingresá el token de recuperación.");
      return;
    }

    if (!passwordClean) {
      Alert.alert("Error", "Ingresá la nueva contraseña.");
      return;
    }

    if (passwordClean.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (passwordClean !== confirmClean) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/reset-password", {
        token: tokenClean,
        newPassword: passwordClean,
      });

      if (!data?.ok) {
        Alert.alert("Error", data?.message || "No se pudo cambiar la contraseña.");
        return;
      }

      Alert.alert("OK", "Contraseña actualizada correctamente.", [
        {
          text: "Ir al login",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo conectar al backend.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, padding: 24, gap: 20 }}>
            <Pressable onPress={() => router.back()}>
              <Text style={{ color: "#1f3b63", fontSize: 16, fontWeight: "700" }}>
                Volver
              </Text>
            </Pressable>

            <Text style={{ fontSize: 34, fontWeight: "800", color: "#111827" }}>
              Nueva contraseña
            </Text>

            <Text style={{ fontSize: 18, color: "#4b5563", lineHeight: 28 }}>
              Ingresá el token y definí tu nueva contraseña.
            </Text>

            <TextInput
              value={token}
              onChangeText={setToken}
              placeholder="Token de recuperación"
              placeholderTextColor="#9ca3af"
              editable={!loading}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 16,
                color: "#111827",
                backgroundColor: "#ffffff",
              }}
            />

            <View
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 16,
                backgroundColor: "#ffffff",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nueva contraseña"
                placeholderTextColor="#9ca3af"
                editable={!loading}
                secureTextEntry={!showNewPassword}
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                  fontSize: 18,
                  color: "#111827",
                }}
              />

              <Pressable
                onPress={() => setShowNewPassword((prev) => !prev)}
                disabled={loading}
                style={{
                  minWidth: 72,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#1f3b63", fontSize: 15, fontWeight: "700" }}>
                  {showNewPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 16,
                backgroundColor: "#ffffff",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmar nueva contraseña"
                placeholderTextColor="#9ca3af"
                editable={!loading}
                secureTextEntry={!showConfirmPassword}
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                  fontSize: 18,
                  color: "#111827",
                }}
              />

              <Pressable
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                disabled={loading}
                style={{
                  minWidth: 72,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#1f3b63", fontSize: 15, fontWeight: "700" }}>
                  {showConfirmPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleReset}
              disabled={loading}
              style={{
                backgroundColor: "#0f9fb3",
                borderRadius: 16,
                paddingVertical: 18,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "800" }}>
                {loading ? "Guardando..." : "Actualizar contraseña"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}