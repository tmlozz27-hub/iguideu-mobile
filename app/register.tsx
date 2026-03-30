import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) return Alert.alert("Error", "Ingresá tu nombre");
    if (!cleanEmail) return Alert.alert("Error", "Ingresá tu email");
    if (!password) return Alert.alert("Error", "Ingresá contraseña");
    if (password.length < 6) return Alert.alert("Error", "Mínimo 6 caracteres");
    if (password !== confirmPassword) return Alert.alert("Error", "No coinciden");
    if (!accepted) return Alert.alert("Error", "Debés aceptar términos");

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password
      });

      if (!data?.ok || !data?.token) {
        Alert.alert("Error", data?.message || "No se pudo registrar");
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_EMAIL_KEY, cleanEmail);

      router.replace("/(tabs)");

    } catch (err: any) {
      Alert.alert("Error", err?.message || "Error conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A9C9F5", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 36, color: "#fff", fontWeight: "800", textAlign: "center", marginBottom: 20 }}>
        I GUIDE U
      </Text>

      <Text style={{ fontSize: 24, color: "#fff", textAlign: "center", marginBottom: 20 }}>
        Crear cuenta
      </Text>

      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={{ backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{ backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 }}
      />

      <Pressable onPress={() => setAccepted(!accepted)}>
        <Text style={{ color: "#fff", marginBottom: 12 }}>
          {accepted ? "☑" : "☐"} Acepto términos
        </Text>
      </Pressable>

      <Pressable
        onPress={handleRegister}
        style={{ backgroundColor: "#fff", padding: 16, borderRadius: 14 }}
      >
        <Text style={{ textAlign: "center", fontWeight: "800" }}>
          {loading ? "Creando..." : "Crear cuenta"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/login")} style={{ marginTop: 16 }}>
        <Text style={{ color: "#fff", textAlign: "center", textDecorationLine: "underline" }}>
          Volver al login
        </Text>
      </Pressable>
    </View>
  );
}