import { apiGet, apiPost } from "@/config/api";
import { translations } from "@/utils/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const lang = "es";
const t = translations[lang];

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "661263042735-677bo9vuvgkds5g80h2phrn683rv3d88.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((token) => {
      if (token) router.replace("/(tabs)");
    });
  }, [router]);

  const saveSession = async (token: string, userEmail?: string) => {
    const cleanEmail = String(userEmail || "").trim().toLowerCase();

    await AsyncStorage.setItem(TOKEN_KEY, String(token));

    if (cleanEmail) {
      await AsyncStorage.setItem(USER_EMAIL_KEY, cleanEmail);
    }

    try {
      const me = await apiGet("/api/auth/me");
      const role = me?.user?.role;

      if (role === "guide") {
        router.replace("/perfil-guia");
        return;
      }

      router.replace("/(tabs)");
    } catch {
      router.replace("/(tabs)");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      await GoogleSignin.signOut();

      const userInfo: any = await GoogleSignin.signIn();

      let idToken =
        userInfo?.idToken ||
        userInfo?.data?.idToken ||
        "";

      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }

      if (!idToken) {
        Alert.alert("Error", "Google no devolvió token");
        return;
      }

      const emailFromGoogle =
        userInfo?.user?.email ||
        userInfo?.data?.user?.email ||
        "";

      const nameFromGoogle =
        userInfo?.user?.name ||
        userInfo?.data?.user?.name ||
        "";

      const data = await apiPost("/api/auth/google", {
        token: idToken,
        email: emailFromGoogle,
        name: nameFromGoogle,
      });

      if (!data?.token) {
        Alert.alert("Error", "Google no validado por backend");
        return;
      }

      await saveSession(data.token, emailFromGoogle);
    } catch (e: any) {
      Alert.alert("Error Google", e?.message || "No se pudo iniciar Google");
    } finally {
      setLoading(false);
    }
  };

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

      await saveSession(data.token, emailClean);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Servidor");
    } finally {
      setLoading(false);
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
              <Text style={{ fontSize: 40, fontWeight: "900", color: "#173B6B" }}>
                I GUIDE U
              </Text>

              <Text style={{ marginTop: 8, color: "#ffffff", fontWeight: "600" }}>
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
                {t.login}
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
                placeholder={t.email}
                placeholderTextColor="#7B879B"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
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
                  placeholder={t.password}
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
                <Text style={{ textAlign: "right", marginTop: 10, color: "#173B6B", fontWeight: "600" }}>
                  {t.forgot}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={{
                  marginTop: 16,
                  backgroundColor: "#173B6B",
                  padding: 16,
                  borderRadius: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
                  {loading ? "Ingresando..." : t.access}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleGoogleLogin}
                disabled={loading}
                style={{
                  marginTop: 10,
                  backgroundColor: "#ffffff",
                  padding: 14,
                  borderRadius: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "700" }}>{t.google}</Text>
              </Pressable>

              <Pressable
                style={{
                  marginTop: 10,
                  backgroundColor: "#000",
                  padding: 14,
                  borderRadius: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>{t.apple}</Text>
              </Pressable>

              <View style={{ alignItems: "center", marginTop: 14 }}>
                <Text style={{ fontSize: 12 }}>
                  <Text onPress={() => router.push("/legal/terms")}>{t.terms}</Text>
                  {" y "}
                  <Text onPress={() => router.push("/legal/privacy")}>{t.privacy}</Text>
                </Text>

                <Pressable
                  onPress={() => router.push("/select-role")}
                  style={{ marginTop: 12 }}
                >
                  <Text style={{ color: "#173B6B", fontWeight: "900", fontSize: 15 }}>
                    ¿No tenés cuenta? Registrarse
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