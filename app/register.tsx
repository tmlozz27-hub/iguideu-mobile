import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiPost } from "@/config/api";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    subtitle: "Tu guia personal de turismo",
    create: "Crear cuenta",
    complete: "Completa tus datos",
    name: "Nombre",
    email: "Correo electronico",
    password: "Contrasena",
    confirm: "Confirmar contrasena",
    creating: "Creando...",
    createBtn: "Crear cuenta",
    already: "Ya tenes cuenta? Iniciar sesion",
    error: "Error",
    fields: "Completa todos los campos",
    mismatch: "Las contrasenas no coinciden",
    registerError: "No se pudo registrar",
    created: "Cuenta creada",
    connectError: "No se pudo conectar"
  },
  en: {
    subtitle: "Your personal travel guide",
    create: "Create account",
    complete: "Complete your information",
    name: "Name",
    email: "Email",
    password: "Password",
    confirm: "Confirm password",
    creating: "Creating...",
    createBtn: "Create account",
    already: "Already have an account? Sign in",
    error: "Error",
    fields: "Complete all fields",
    mismatch: "Passwords do not match",
    registerError: "Could not register",
    created: "Account created",
    connectError: "Could not connect"
  }
};

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const [lang, setLang] = useState<"es" | "en">("es");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const t = copy[lang];

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((savedLang) => {
      if (savedLang === "es" || savedLang === "en") {
        setLang(savedLang);
      }
    });
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      Alert.alert(t.error, t.fields);
      return;
    }

    if (password !== confirm) {
      Alert.alert(t.error, t.mismatch);
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
        Alert.alert(t.error, t.registerError);
        return;
      }

      Alert.alert("OK", t.created);

      router.replace("/login");
    } catch {
      Alert.alert(t.error, t.connectError);
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
                {t.subtitle}
              </Text>
            </View>

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
                {t.create}
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#666",
                }}
              >
                {t.complete}
              </Text>

              <TextInput
                placeholder={t.name}
                value={name}
                onChangeText={setName}
                style={input}
              />

              <TextInput
                placeholder={t.email}
                value={email}
                onChangeText={setEmail}
                style={input}
              />

              <TextInput
                placeholder={t.password}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={input}
              />

              <TextInput
                placeholder={t.confirm}
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
                  {loading ? t.creating : t.createBtn}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.replace("/login")}
                style={{ marginTop: 16 }}
              >
                <Text style={{ textAlign: "center" }}>
                  {t.already}
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