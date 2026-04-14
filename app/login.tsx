import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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

  useEffect(() => {
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

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
          <View pointerEvents="none" style={styles.bgBase} />
          <View pointerEvents="none" style={styles.bgOverlay} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.brandBlock}>
              <Text style={styles.brand}>I GUIDE U</Text>
              <Text style={styles.brandSubtitle}>
                Tu guía personal de turismo
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardTopBar} />

              <Text style={styles.title}>Iniciar sesión</Text>
              <Text style={styles.subtitle}>
                Accedé a tu cuenta para continuar
              </Text>

              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#7B879B"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                style={styles.input}
              />

              <View style={styles.passwordWrap}>
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor="#7B879B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.passwordInput}
                />

                <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                  <Text style={styles.toggleText}>
                    {showPassword ? "Ocultar" : "Ver"}
                  </Text>
                </Pressable>
              </View>

              <Pressable onPress={() => router.push("/forgot-password")}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </Pressable>

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Ingresando..." : "Acceder"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert("Google", "Próximamente")}
                style={styles.googleButton}
              >
                <Text style={styles.googleButtonText}>
                  Continuar con Google
                </Text>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert("Facebook", "Próximamente")}
                style={styles.facebookButton}
              >
                <Text style={styles.facebookButtonText}>
                  Continuar con Facebook
                </Text>
              </Pressable>

              <View style={styles.registerBlock}>
                <Text style={styles.registerHint}>¿No tienes cuenta?</Text>

                <Pressable onPress={() => router.push("/select-role")}>
                  <Text style={styles.registerLink}>Registrarse</Text>
                </Pressable>
              </View>

              <View style={styles.legalRow}>
                <Pressable onPress={() => router.push("/legal/terms")}>
                  <Text style={styles.legalLink}>Términos</Text>
                </Pressable>

                <Text style={styles.legalDot}>•</Text>

                <Pressable onPress={() => router.push("/legal/privacy")}>
                  <Text style={styles.legalLink}>Privacidad</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: "#0B3E91",
  },
  screen: {
    flex: 1,
    backgroundColor: "#0B3E91",
  },
  bgBase: {
    position: "absolute",
    inset: 0,
    backgroundColor: "#0B3E91",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(165,205,255,0.08)",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingTop: 34,
    paddingBottom: 30,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 24,
  },
  brand: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 3,
    textAlign: "center",
  },
  brandSubtitle: {
    color: "#F3F8FF",
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#F0F8FF",
    borderRadius: 32,
    paddingHorizontal: 30,
    paddingTop: 34,
    paddingBottom: 32,
  },
  cardTopBar: {
    alignSelf: "center",
    width: 112,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#7DD3FC",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#1A2A44",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7A90",
    marginTop: 8,
    marginBottom: 18,
    fontSize: 15,
  },
  input: {
    backgroundColor: "#F6F8FB",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DFE6F0",
    fontSize: 16,
    color: "#1A2A44",
  },
  passwordWrap: {
    flexDirection: "row",
    backgroundColor: "#F6F8FB",
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFE6F0",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1A2A44",
  },
  toggleText: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#2A5DB8",
    fontWeight: "700",
  },
  forgotText: {
    textAlign: "right",
    marginTop: 10,
    color: "#2A5DB8",
    fontWeight: "600",
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#0E5BD7",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    fontWeight: "800",
    fontSize: 20,
    color: "#FFFFFF",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  googleButtonText: {
    fontWeight: "700",
    color: "#172033",
    fontSize: 17,
  },
  facebookButton: {
    backgroundColor: "#1877F2",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  facebookButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
  registerBlock: {
    alignItems: "center",
    marginTop: 16,
  },
  registerHint: {
    color: "#6B7A90",
    fontSize: 15,
  },
  registerLink: {
    fontWeight: "800",
    color: "#2A5DB8",
    marginTop: 6,
    fontSize: 17,
  },
  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  legalLink: {
    color: "#6B7A90",
    textDecorationLine: "underline",
  },
  legalDot: {
    marginHorizontal: 8,
    color: "#6B7A90",
  },
});