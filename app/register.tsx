import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

function mapRegisterError(message?: string) {
  const code = String(message || "").trim();

  if (code === "EMAIL_ALREADY_EXISTS") {
    return "Ese email ya está registrado. Probá iniciar sesión o recuperar tu contraseña.";
  }

  if (code === "NAME_EMAIL_PASSWORD_REQUIRED") {
    return "Completá nombre, email y contraseña.";
  }

  if (code === "PASSWORD_MIN_6") {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (code === "REGISTER_ERROR") {
    return "No se pudo crear la cuenta. Intentá nuevamente.";
  }

  return code || "No se pudo registrar.";
}

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isGuide = role === "guide";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      Alert.alert("Error", isGuide ? "Ingresá tu nombre completo" : "Ingresá tu nombre");
      return;
    }

    if (!cleanEmail) {
      Alert.alert("Error", "Ingresá tu email");
      return;
    }

    if (!password) {
      Alert.alert("Error", "Ingresá una contraseña");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!accepted) {
      Alert.alert("Error", "Debés aceptar los términos");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/api/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password,
        role: isGuide ? "guide" : "traveler"
      });

      if (!data?.ok || !data?.token) {
        Alert.alert("Error", mapRegisterError(data?.message));
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_EMAIL_KEY, cleanEmail);

      Alert.alert(
        isGuide ? "Cuenta de guía creada" : "Cuenta creada",
        "Continuá completando tu perfil",
        [
          {
            text: "OK",
            onPress: () => {
              if (isGuide) {
                router.replace("/perfil-guia");
              } else {
                router.replace("/perfil-viajero");
              }
            }
          }
        ]
      );
    } catch (err: any) {
      Alert.alert("Error", mapRegisterError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A9C9F5", justifyContent: "center", padding: 24 }}>
      <Text
        style={{
          fontSize: 36,
          color: "#fff",
          fontWeight: "800",
          textAlign: "center",
          marginBottom: 20
        }}
      >
        I GUIDE U
      </Text>

      <Text
        style={{
          fontSize: 24,
          color: "#fff",
          textAlign: "center",
          marginBottom: 20
        }}
      >
        {isGuide ? "Registro de guía" : "Crear cuenta"}
      </Text>

      <TextInput
        placeholder={isGuide ? "Nombre completo" : "Nombre"}
        value={name}
        onChangeText={setName}
        editable={!loading}
        style={{ backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
        style={{ backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 }}
      />

      <View style={{ marginBottom: 10 }}>
        <TextInput
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          style={{ backgroundColor: "#fff", padding: 14, paddingRight: 90, borderRadius: 12 }}
        />
        <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          style={{ position: "absolute", right: 14, top: 14 }}
        >
          <Text style={{ color: "#4A78B8", fontWeight: "700" }}>
            {showPassword ? "Ocultar" : "Ver"}
          </Text>
        </Pressable>
      </View>

      <View style={{ marginBottom: 10 }}>
        <TextInput
          placeholder="Confirmar contraseña"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
          style={{ backgroundColor: "#fff", padding: 14, paddingRight: 90, borderRadius: 12 }}
        />
        <Pressable
          onPress={() => setShowConfirmPassword((prev) => !prev)}
          style={{ position: "absolute", right: 14, top: 14 }}
        >
          <Text style={{ color: "#4A78B8", fontWeight: "700" }}>
            {showConfirmPassword ? "Ocultar" : "Ver"}
          </Text>
        </Pressable>
      </View>

      <Pressable disabled={loading} onPress={() => setAccepted(!accepted)}>
        <Text style={{ color: "#fff", marginBottom: 12 }}>
          {accepted ? "☑" : "☐"} Acepto términos
        </Text>
      </Pressable>

      <Pressable
        disabled={loading}
        onPress={handleRegister}
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 14,
          opacity: loading ? 0.7 : 1
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "800" }}>
          {loading ? "Creando..." : isGuide ? "Crear cuenta de guía" : "Crear cuenta"}
        </Text>
      </Pressable>

      <Pressable disabled={loading} onPress={() => router.replace("/login")} style={{ marginTop: 16 }}>
        <Text style={{ color: "#fff", textAlign: "center", textDecorationLine: "underline" }}>
          Volver al login
        </Text>
      </Pressable>
    </View>
  );
}