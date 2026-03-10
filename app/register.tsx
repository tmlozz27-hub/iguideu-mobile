import React, { useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const nameClean = String(name || "").trim();
    const emailClean = String(email || "").trim().toLowerCase();
    const passwordClean = String(password || "").trim();

    if (!nameClean || !emailClean || !passwordClean) {
      Alert.alert("Faltan datos", "Completá nombre, email y contraseña.");
      return;
    }

    if (passwordClean.length < 6) {
      Alert.alert("Contraseña inválida", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: nameClean,
          email: emailClean,
          password: passwordClean
        })
      });

      const data = await response.json();

      if (!response.ok || !data?.ok || !data?.token) {
        Alert.alert("Error", data?.message || "No se pudo registrar la cuenta.");
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, String(data.token));
      await AsyncStorage.setItem(USER_EMAIL_KEY, emailClean);

      Alert.alert("OK", "Cuenta creada correctamente.");
      router.replace("/(tabs)");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo conectar al backend.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f9fb3" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 40
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
            Registrarse
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre completo"
            placeholderTextColor="#9ca3af"
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
              backgroundColor: "#ffffff"
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor="#9ca3af"
            secureTextEntry
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
            onPress={handleRegister}
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
              {loading ? "Creando cuenta..." : "REGISTRARSE"}
            </Text>
          </Pressable>

          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: "#1f3b63", fontSize: 18 }}>
              ¿Ya tienes cuenta?
            </Text>

            <Pressable onPress={() => router.replace("/login")}>
              <Text
                style={{
                  color: "#0f3f78",
                  fontSize: 22,
                  fontWeight: "800",
                  marginTop: 6
                }}
              >
                Volver a iniciar sesión
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}