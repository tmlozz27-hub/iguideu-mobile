import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "../config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (mounted && token) {
          router.replace("/(tabs)");
          return;
        }
      } catch {}

      if (mounted) {
        setCheckingSession(false);
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogin = async () => {
    const emailClean = String(email || "").trim().toLowerCase();
    const passwordClean = String(password || "").trim();

    if (!emailClean || !passwordClean) {
      Alert.alert("Faltan datos", "Ingresá email y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/login", {
        email: emailClean,
        password: passwordClean,
      });

      if (!data?.ok || !data?.token) {
        const rawMessage = String(data?.message || data?.error || "").toUpperCase();

        if (rawMessage.includes("INVALID_CREDENTIALS")) {
          Alert.alert("Error", "Email o contraseña incorrectos.");
        } else {
          Alert.alert("Error", data?.message || "No se pudo iniciar sesión.");
        }
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, String(data.token));
      await AsyncStorage.setItem(USER_EMAIL_KEY, emailClean);

      router.replace("/(tabs)");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo conectar al backend.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0f9fb3", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "700" }}>
          Verificando sesión...
        </Text>
      </SafeAreaView>
    );
  }

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
                Iniciar sesión
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
                  placeholder="Contraseña"
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

              <Pressable onPress={() => router.push("/forgot-password")}>
                <Text
                  style={{
                    textAlign: "right",
                    color: "#1f3b63",
                    fontSize: 16,
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogin}
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
                  {loading ? "Ingresando..." : "Acceder"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert("Próximo paso", "Google login se conecta después del flujo legal y recuperación.")}
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <Text style={{ color: "#374151", fontSize: 18, fontWeight: "600" }}>
                  Acceder con Google
                </Text>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert("Próximo paso", "Facebook login se conecta después del flujo legal y recuperación.")}
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <Text style={{ color: "#374151", fontSize: 18, fontWeight: "600" }}>
                  Acceder con Facebook
                </Text>
              </Pressable>

              <View style={{ alignItems: "center", marginTop: 8 }}>
                <Text style={{ color: "#1f3b63", fontSize: 18 }}>
                  ¿No tienes cuenta?
                </Text>

                <Pressable onPress={() => router.push("/register")} style={{ marginTop: 6 }}>
                  <Text style={{ color: "#0f3f78", fontWeight: "800", fontSize: 18 }}>
                    Registrarse
                  </Text>
                </Pressable>
              </View>

              <View style={{ alignItems: "center", marginTop: 6, gap: 10 }}>
                <Pressable onPress={() => router.push("/legal/terms")}>
                  <Text style={{ color: "#1f3b63", fontSize: 15, textDecorationLine: "underline" }}>
                    Términos y condiciones
                  </Text>
                </Pressable>

                <Pressable onPress={() => router.push("/legal/privacy")}>
                  <Text style={{ color: "#1f3b63", fontSize: 15, textDecorationLine: "underline" }}>
                    Política de privacidad
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}