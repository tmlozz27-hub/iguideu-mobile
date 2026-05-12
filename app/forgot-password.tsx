import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { apiPost } from "@/config/api";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    title: "Recuperar contraseña",
    subtitle:
      "Ingresá tu email y te enviaremos instrucciones para recuperar el acceso.",
    email: "Email",
    processing: "Procesando...",
    continue: "Continuar",
    back: "Volver al login",
    error: "Error",
    notice: "Aviso",
    enterEmail: "Ingresá tu email.",
    tokenOk:
      "Token generado correctamente. Continuá con la nueva contraseña.",
    continueBtn: "Seguir",
    sent:
      "Si el email existe, enviamos instrucciones para recuperar la contraseña.",
    processError: "No se pudo procesar la recuperación.",
    backendError: "No se pudo conectar al backend."
  },
  en: {
    title: "Recover password",
    subtitle:
      "Enter your email and we will send instructions to recover access.",
    email: "Email",
    processing: "Processing...",
    continue: "Continue",
    back: "Back to login",
    error: "Error",
    notice: "Notice",
    enterEmail: "Enter your email.",
    tokenOk:
      "Token generated successfully. Continue with the new password.",
    continueBtn: "Continue",
    sent:
      "If the email exists, recovery instructions were sent.",
    processError: "Recovery could not be processed.",
    backendError: "Could not connect to backend."
  }
};

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
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

  const handleRecover = async () => {
    const emailClean = String(email || "")
      .trim()
      .toLowerCase();

    if (!emailClean) {
      Alert.alert(t.error, t.enterEmail);
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost(
        "/api/auth/forgot-password",
        {
          email: emailClean
        }
      );

      if (data?.ok && data?.token) {
        Alert.alert(
          "OK",
          t.tokenOk,
          [
            {
              text: t.continueBtn,
              onPress: () =>
                router.push("/reset-password")
            }
          ]
        );

        return;
      }

      if (data?.ok) {
        Alert.alert("OK", t.sent);
        return;
      }

      const message = String(data?.message || "");

      Alert.alert(
        t.notice,
        message || t.processError
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t.backendError;

      Alert.alert(
        t.notice,
        message || t.processError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0f9fb3"
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
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
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "800",
                  color: "#111827"
                }}
              >
                {t.title}
              </Text>

              <Text
                style={{
                  color: "#374151",
                  fontSize: 16
                }}
              >
                {t.subtitle}
              </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t.email}
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
                  backgroundColor: "#ffffff"
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
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 22,
                    fontWeight: "800"
                  }}
                >
                  {loading
                    ? t.processing
                    : t.continue}
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.replace("/login")
                }
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10
                }}
              >
                <Text
                  style={{
                    color: "#1f3b63",
                    fontSize: 16,
                    fontWeight: "700"
                  }}
                >
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