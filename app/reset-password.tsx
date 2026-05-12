import React, { useCallback, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { apiPost } from "@/config/api";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    title: "Nueva contraseña",
    subtitle: "Ingresá el token y definí tu nueva contraseña.",
    tokenPlaceholder: "Token de recuperación",
    passwordPlaceholder: "Nueva contraseña",
    confirmPlaceholder: "Confirmar nueva contraseña",
    show: "Ver",
    hide: "Ocultar",
    saving: "Guardando...",
    update: "Actualizar contraseña",
    back: "Volver al login",
    error: "Error",
    done: "Listo",
    enterToken: "Ingresá el token de recuperación.",
    enterPassword: "Ingresá la nueva contraseña.",
    shortPassword: "La contraseña debe tener al menos 6 caracteres.",
    mismatch: "Las contraseñas no coinciden.",
    invalidToken: "El token no es válido o venció.",
    resetError: "No se pudo cambiar la contraseña.",
    success: "Contraseña actualizada correctamente.",
    goLogin: "Ir al login",
    serverError: "No se pudo conectar con el servidor."
  },
  en: {
    title: "New password",
    subtitle: "Enter the token and set your new password.",
    tokenPlaceholder: "Recovery token",
    passwordPlaceholder: "New password",
    confirmPlaceholder: "Confirm new password",
    show: "Show",
    hide: "Hide",
    saving: "Saving...",
    update: "Update password",
    back: "Back to login",
    error: "Error",
    done: "Done",
    enterToken: "Enter the recovery token.",
    enterPassword: "Enter the new password.",
    shortPassword: "Password must be at least 6 characters.",
    mismatch: "Passwords do not match.",
    invalidToken: "The token is invalid or expired.",
    resetError: "Password could not be changed.",
    success: "Password updated successfully.",
    goLogin: "Go to login",
    serverError: "Could not connect to the server."
  }
};

export default function ResetPasswordScreen() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");

  const t = copy[lang];

  const loadLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);

    if (savedLang === "es" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    loadLang();
  }, [loadLang]);

  const handleReset = async () => {
    const tokenClean = String(token || "").trim();
    const passwordClean = String(password || "").trim();
    const confirmPasswordClean = String(confirmPassword || "").trim();

    if (!tokenClean) {
      Alert.alert(t.error, t.enterToken);
      return;
    }

    if (!passwordClean) {
      Alert.alert(t.error, t.enterPassword);
      return;
    }

    if (passwordClean.length < 6) {
      Alert.alert(t.error, t.shortPassword);
      return;
    }

    if (passwordClean !== confirmPasswordClean) {
      Alert.alert(t.error, t.mismatch);
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/reset-password", {
        token: tokenClean,
        password: passwordClean
      });

      if (!data?.ok) {
        const rawMessage = String(data?.message || data?.error || "").toUpperCase();

        if (rawMessage.includes("INVALID") || rawMessage.includes("TOKEN")) {
          Alert.alert(t.error, t.invalidToken);
        } else {
          Alert.alert(t.error, t.resetError);
        }

        return;
      }

      Alert.alert(t.done, t.success, [
        {
          text: t.goLogin,
          onPress: () => router.replace("/login")
        }
      ]);
    } catch {
      Alert.alert(t.error, t.serverError);
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
              paddingBottom: 24
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
                gap: 16
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827" }}>
                {t.title}
              </Text>

              <Text style={{ color: "#374151", fontSize: 16 }}>
                {t.subtitle}
              </Text>

              <TextInput
                value={token}
                onChangeText={setToken}
                placeholder={t.tokenPlaceholder}
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
                  backgroundColor: "#ffffff"
                }}
              />

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 14,
                  backgroundColor: "#ffffff",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t.passwordPlaceholder}
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 18,
                    color: "#111827"
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
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ color: "#1f3b63", fontSize: 15, fontWeight: "700" }}>
                    {showPassword ? t.hide : t.show}
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
                  alignItems: "center"
                }}
              >
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t.confirmPlaceholder}
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 18,
                    color: "#111827"
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
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ color: "#1f3b63", fontSize: 15, fontWeight: "700" }}>
                    {showConfirmPassword ? t.hide : t.show}
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
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
                  {loading ? t.saving : t.update}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.replace("/login")}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10
                }}
              >
                <Text style={{ color: "#1f3b63", fontSize: 16, fontWeight: "700" }}>
                  {t.back}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}