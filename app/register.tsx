import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";
const ROLE_KEY = "iguideu_pending_role";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem(ROLE_KEY);
        if (savedRole === "guide" || savedRole === "traveler") {
          setRole(savedRole);
        }
      } catch {}
    };

    loadRole();
  }, []);

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameClean,
          email: emailClean,
          password: passwordClean,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        Alert.alert("Error", data?.message || "No se pudo registrar la cuenta.");
        return;
      }

      await AsyncStorage.multiRemove([TOKEN_KEY, USER_EMAIL_KEY]);
      await AsyncStorage.setItem(USER_EMAIL_KEY, emailClean);
      await AsyncStorage.removeItem(ROLE_KEY);

      Alert.alert(
        "OK",
        "Cuenta creada correctamente. Ahora iniciá sesión con tu email y contraseña.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo conectar al backend.";
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
          paddingTop: 40,
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
            Registrarse
          </Text>

          <Text style={{ color: "#1f3b63", fontSize: 16 }}>
            Perfil elegido: {role === "guide" ? "Guía" : "Viajero"}
          </Text>

          <Pressable onPress={() => router.replace("/select-role")}>
            <Text style={{ color: "#0f3f78", fontSize: 16, fontWeight: "700" }}>
              Cambiar perfil
            </Text>
          </Pressable>

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
              backgroundColor: "#ffffff",
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

          <Pressable
            onPress={handleRegister}
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
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Text>
          </Pressable>

          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: "#1f3b63", fontSize: 18 }}>
              ¿Ya tienes cuenta?
            </Text>

            <Pressable onPress={() => router.replace("/login")} style={{ marginTop: 6 }}>
              <Text style={{ color: "#0f3f78", fontWeight: "800", fontSize: 18 }}>
                Iniciar sesión
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
