import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { apiPost } from "@/config/api";

export default function ResetPasswordScreen() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const tokenClean = String(token || "").trim();
    const passwordClean = String(password || "").trim();
    const confirmPasswordClean = String(confirmPassword || "").trim();

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

    if (passwordClean !== confirmPasswordClean) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/reset-password", {
        token: tokenClean,
        password: passwordClean,
      });

      if (!data?.ok) {
        const rawMessage = String(data?.message || data?.error || "").toUpperCase();

        if (rawMessage.includes("INVALID") || rawMessage.includes("TOKEN")) {
          Alert.alert("Error", "El token no es válido o venció.");
        } else {
          Alert.alert("Error", "No se pudo cambiar la contraseña.");
        }
        return;
      }

      Alert.alert("Listo", "Contraseña actualizada correctamente.", [
        {
          text: "Ir al login",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
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
                Nueva contraseña
              </Text>

              <Text style={{ color: "#374151", fontSize: 16 }}>
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
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 18,
                  color: "#111827",
                  backgroundColor: "#ffffff",
                }}
              />

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 14,
                  backgroundColor: "#ffffff",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nueva contraseña"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 18,
                    color: "#111827",
                  }}
                />

                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
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
                    {showPassword ? "Ocultar" : "Ver"}
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 14,
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
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
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
                  backgroundColor: "#f6c744",
                  borderRadius: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
                  {loading ? "Guardando..." : "Actualizar contraseña"}
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
