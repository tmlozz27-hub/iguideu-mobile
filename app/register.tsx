import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { apiPost } from "@/config/api";

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      Alert.alert("Error", "Completá todos los campos");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/register", {
        name,
        email,
        password,
        role: role || "traveler",
      });

      if (!data?.ok) {
        Alert.alert("Error", "No se pudo registrar");
        return;
      }

      Alert.alert("OK", "Cuenta creada");

      router.replace("/login");
    } catch {
      Alert.alert("Error", "No se pudo conectar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4B8FE8" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 18,
            }}
          >
            {/* LOGO */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <Text style={{ fontSize: 28 }}>📍</Text>

              <Text
                style={{
                  color: "#fff",
                  fontSize: 38,
                  fontWeight: "800",
                }}
              >
                I GUIDE U
              </Text>

              <Text style={{ color: "#fff" }}>
                Tu guía personal de turismo
              </Text>
            </View>

            {/* CARD */}
            <View
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 28,
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  textAlign: "center",
                }}
              >
                Crear cuenta
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#666",
                }}
              >
                Completá tus datos
              </Text>

              <TextInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                style={input}
              />

              <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={input}
              />

              <TextInput
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={input}
              />

              <TextInput
                placeholder="Confirmar contraseña"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                style={input}
              />

              <Pressable
                onPress={handleRegister}
                style={{
                  backgroundColor: "#F4C63D",
                  padding: 18,
                  borderRadius: 14,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "800",
                    fontSize: 20,
                    color: "#fff",
                  }}
                >
                  {loading ? "Creando..." : "Crear cuenta"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.replace("/login")}
                style={{ marginTop: 16 }}
              >
                <Text style={{ textAlign: "center" }}>
                  ¿Ya tenés cuenta? Iniciar sesión
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const input = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  padding: 14,
  marginBottom: 12,
};
