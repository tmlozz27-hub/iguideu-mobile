import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "@/config/api";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0B8FA4", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "700" }}>
          Verificando sesión...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B8FA4" }}>
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
              paddingTop: 26,
              paddingBottom: 24,
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
                marginBottom: 34,
                position: "relative",
              }}
            >
              <Text
                style={{
                  position: "absolute",
                  left: 40,
                  top: 6,
                  fontSize: 28,
                }}
              >
                📍
              </Text>

              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 42,
                  fontWeight: "800",
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                I GUIDE U
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                backgroundColor: "#ffffff",
                borderRadius: 28,
                paddingHorizontal: 22,
                paddingTop: 24,
                paddingBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#162033",
                  marginBottom: 20,
                }}
              >
                Iniciar sesión
              </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Correo electrónico"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                  fontSize: 18,
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  marginBottom: 14,
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
                    paddingVertical: 18,
                    fontSize: 18,
                    color: "#111827",
                  }}
                />

                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  style={{
                    minWidth: 82,
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

              <Pressable onPress={() => router.push("/forgot-password")} style={{ marginTop: 14 }}>
                <Text style={{ textAlign: "right", color: "#183B63", fontSize: 16 }}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={{
                  backgroundColor: "#F4C63D",
                  borderRadius: 14,
                  paddingVertical: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loading ? 0.7 : 1,
                  marginTop: 18,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "800" }}>
                  {loading ? "Ingresando..." : "Acceder"}
                </Text>
              </Pressable>

              <View style={{ alignItems: "center", marginTop: 26 }}>
                <Text style={{ color: "#183B63", fontSize: 18 }}>
                  ¿No tienes cuenta?
                </Text>

                <Pressable onPress={() => router.push("/select-role")} style={{ marginTop: 8 }}>
                  <Text style={{ color: "#0F3F78", fontWeight: "800", fontSize: 20 }}>
                    Registrarse
                  </Text>
                </Pressable>
              </View>

              <View style={{ alignItems: "center", marginTop: 20, gap: 10 }}>
                <Pressable onPress={() => router.push("/legal/terms")}>
                  <Text style={{ color: "#1f3b63", fontSize: 14, textDecorationLine: "underline" }}>
                    Términos y condiciones
                  </Text>
                </Pressable>

                <Pressable onPress={() => router.push("/legal/privacy")}>
                  <Text style={{ color: "#1f3b63", fontSize: 14, textDecorationLine: "underline" }}>
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