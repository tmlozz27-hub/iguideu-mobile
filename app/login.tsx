import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "@/config/api";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

const GOOGLE_ANDROID_CLIENT_ID =
  "1029517266976-b0ag2bt7u88hj3sb39ffc67umpa83veb.apps.googleusercontent.com";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectUri = makeRedirectUri({
    scheme: "iguideu",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((token) => {
      if (token) router.replace("/(tabs)");
    });
  }, [router]);

  useEffect(() => {
    if (response?.type === "success") {
      Alert.alert("Google", "Google login OK");
    } else if (response?.type === "error") {
      Alert.alert("Google", "Error al iniciar con Google");
    }
  }, [response]);

  const handleLogin = async () => {
    const emailClean = String(email || "").trim().toLowerCase();
    const passwordClean = String(password || "").trim();

    if (!emailClean || !passwordClean) {
      Alert.alert("Error", "Completá email y contraseña");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/login", {
        email: emailClean,
        password: passwordClean,
      });

      if (!data?.token) {
        Alert.alert("Error", "Credenciales incorrectas");
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, String(data.token));
      await AsyncStorage.setItem(USER_EMAIL_KEY, emailClean);

      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!request) {
        Alert.alert("Google", "Google no está listo todavía");
        return;
      }

      await promptAsync();
    } catch {
      Alert.alert("Google", "No se pudo iniciar Google");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(183,209,245,0.55)",
          }}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingTop: 40,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: "900",
                  color: "#173B6B",
                }}
              >
                I GUIDE U
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: "#ffffff",
                  fontWeight: "600",
                }}
              >
                Tu guía personal de turismo
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.10)",
                borderRadius: 30,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#173B6B",
                }}
              >
                Iniciar sesión
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  marginBottom: 16,
                  color: "rgba(23,59,107,0.8)",
                }}
              >
                Accedé a tu cuenta para continuar
              </Text>

              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#7B879B"
                value={email}
                onChangeText={setEmail}
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: 18,
                  padding: 14,
                  marginBottom: 12,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: 18,
                  alignItems: "center",
                }}
              >
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor="#7B879B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, padding: 14 }}
                />

                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Text style={{ paddingHorizontal: 16, color: "#173B6B" }}>
                    {showPassword ? "Ocultar" : "Ver"}
                  </Text>
                </Pressable>
              </View>

              <Pressable onPress={() => router.push("/forgot-password")}>
                <Text
                  style={{
                    textAlign: "right",
                    marginTop: 10,
                    color: "#173B6B",
                    fontWeight: "600",
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogin}
                style={{
                  marginTop: 16,
                  backgroundColor: "#173B6B",
                  padding: 16,
                  borderRadius: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
                  {loading ? "Ingresando..." : "Acceder"}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleGoogleLogin}
                disabled={!request}
                style={{
                  marginTop: 10,
                  backgroundColor: "#ffffff",
                  padding: 14,
                  borderRadius: 20,
                  alignItems: "center",
                  opacity: request ? 1 : 0.7,
                }}
              >
                <Text style={{ fontWeight: "700" }}>
                  Continuar con Google
                </Text>
              </Pressable>

              <Pressable
                style={{
                  marginTop: 10,
                  backgroundColor: "#1877F2",
                  padding: 14,
                  borderRadius: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Continuar con Facebook
                </Text>
              </Pressable>

              <View style={{ alignItems: "center", marginTop: 16 }}>
                <Text>¿No tienes cuenta?</Text>
                <Pressable onPress={() => router.push("/select-role")}>
                  <Text style={{ fontWeight: "800", color: "#173B6B" }}>
                    Registrarse
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}