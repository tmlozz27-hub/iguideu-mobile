import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiPost } from "@/config/api";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();

  const initialRole = params?.role === "guide" ? "guide" : "traveler";

  const [role] = useState<"guide" | "traveler">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      const data = await apiPost("/api/auth/register", {
        name: nameClean,
        email: emailClean,
        password: passwordClean,
        role,
      });

      if (!data?.ok) {
        Alert.alert("Error", data?.message || "No se pudo crear la cuenta.");
        return;
      }

      Alert.alert(
        "Cuenta creada",
        "Cuenta creada correctamente. Ahora iniciá sesión con tu email y contraseña.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo conectar al backend.";
      Alert.alert("Error", message);
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
                Crear cuenta
              </Text>

              <Text style={{ color: "#374151", fontSize: 16 }}>
                Perfil elegido: {role === "guide" ? "Guía" : "Viajero"}
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Nombre"
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
                  {loading ? "Creando..." : "Crear cuenta"}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}