import { apiPost } from "@/config/api";
import { translations } from "@/utils/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const lang = "es";
const t = translations[lang];

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure();

    AsyncStorage.getItem(TOKEN_KEY).then((token) => {
      if (token) router.replace("/(tabs)");
    });
  }, [router]);

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
      setGoogleLoading(true);

      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      let userEmail = "";

      if ("data" in result && result.data?.user?.email) {
        userEmail = String(result.data.user.email);
      } else if ("user" in result && result.user?.email) {
        userEmail = String(result.user.email);
      }

      await AsyncStorage.setItem(TOKEN_KEY, "google_login_ok");
      if (userEmail) {
        await AsyncStorage.setItem(USER_EMAIL_KEY, userEmail);
      }

      Alert.alert("Google", "Cuenta seleccionada correctamente");
      router.replace("/(tabs)");
    } catch (error: unknown) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) return;

        if (error.code === statusCodes.IN_PROGRESS) {
          Alert.alert("Google", "Google ya está abriéndose");
          return;
        }

        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert("Google", "Google Play Services no disponible");
          return;
        }

        Alert.alert("Google", `Error: ${error.code}`);
        return;
      }

      Alert.alert("Google", "No se pudo iniciar Google");
    } finally {
      setGoogleLoading(false);
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

        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingTop: 40,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
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
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 30,
                padding: 24,
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

              <TextInput
                placeholder={t.email}
                value={email}
                onChangeText={setEmail}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  padding: 14,
                  marginBottom: 12,
                }}
              />

              <TextInput
                placeholder={t.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  padding: 14,
                }}
              />

              <Pressable
                onPress={handleLogin}
                style={{
                  marginTop: 16,
                  backgroundColor: "#173B6B",
                  padding: 16,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  {loading ? "..." : t.access}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleGoogleLogin}
                style={{
                  marginTop: 10,
                  backgroundColor: "#fff",
                  padding: 14,
                  borderRadius: 20,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "700" }}>
                  {googleLoading ? "Abriendo Google..." : t.google}
                </Text>
              </Pressable>

              <Pressable
                style={{
                  marginTop: 10,
                  backgroundColor: "#000",
                  padding: 14,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  {t.apple}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}