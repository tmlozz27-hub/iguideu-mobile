import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet, apiPut } from "../../config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

type MeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      const data = await apiGet("/api/auth/me", {
        Authorization: `Bearer ${token}`
      });

      if (!data?.ok || !data?.user) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      setUser(data.user);
      setNameInput(String(data.user?.name || ""));

      if (data.user?.email) {
        await AsyncStorage.setItem(USER_EMAIL_KEY, String(data.user.email));
      }
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    const nextName = String(nameInput || "").trim();

    if (!nextName) {
      Alert.alert("Falta el nombre", "Ingresá un nombre válido.");
      return;
    }

    try {
      setSaving(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        Alert.alert("Error", "No hay sesión activa.");
        return;
      }

      const data = await apiPut(
        "/api/auth/me",
        { name: nextName },
        {
          Authorization: `Bearer ${token}`
        }
      );

      if (!data?.ok || !data?.user) {
        Alert.alert("Error", data?.message || "No se pudo actualizar el perfil.");
        return;
      }

      setUser(data.user);
      setNameInput(String(data.user?.name || ""));
      Alert.alert("OK", "Perfil actualizado.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo conectar al backend.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_EMAIL_KEY]);
      router.replace("/login");
    } catch {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Querés salir de tu cuenta ahora?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: handleLogout }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 4 }}>
          Perfil
        </Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#ffffff"
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 12 }}>
            Mi cuenta
          </Text>

          <Text style={{ marginBottom: 8 }}>
            Email: {loadingUser ? "Cargando..." : user?.email || "No disponible"}
          </Text>

          <Text style={{ marginBottom: 8 }}>
            Rol: {loadingUser ? "Cargando..." : user?.role || "traveler"}
          </Text>

          <Text style={{ marginBottom: 8, fontWeight: "700" }}>
            Nombre
          </Text>

          <TextInput
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Tu nombre"
            editable={!loadingUser && !saving}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 14,
              fontSize: 16,
              backgroundColor: "#ffffff",
              marginBottom: 12
            }}
          />

          <Pressable
            onPress={handleSaveProfile}
            disabled={loadingUser || saving}
            style={{
              backgroundColor: "#0f9fb3",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              opacity: loadingUser || saving ? 0.7 : 1
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "800", fontSize: 16 }}>
              {saving ? "Guardando..." : "Guardar perfil"}
            </Text>
          </Pressable>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 12,
              padding: 14
            }}
          >
            <Text style={{ fontWeight: "700" }}>Seguridad</Text>
            <Text style={{ opacity: 0.7, marginTop: 4 }}>
              Auth real en Mongo conectado
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/legal/terms")}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 12,
              padding: 14,
              backgroundColor: "#ffffff"
            }}
          >
            <Text style={{ fontWeight: "800", color: "#111827" }}>
              Términos y condiciones
            </Text>
            <Text style={{ opacity: 0.8, marginTop: 4, color: "#374151" }}>
              Ver condiciones de uso de I GUIDE U
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/legal/privacy")}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 12,
              padding: 14,
              backgroundColor: "#ffffff"
            }}
          >
            <Text style={{ fontWeight: "800", color: "#111827" }}>
              Política de privacidad
            </Text>
            <Text style={{ opacity: 0.8, marginTop: 4, color: "#374151" }}>
              Ver cómo se tratan y protegen tus datos
            </Text>
          </Pressable>

          <Pressable
            onPress={confirmLogout}
            style={{
              borderWidth: 1,
              borderColor: "#ef4444",
              borderRadius: 12,
              padding: 14,
              backgroundColor: "#fff5f5"
            }}
          >
            <Text style={{ fontWeight: "800", color: "#b91c1c" }}>
              Cerrar sesión
            </Text>
            <Text style={{ opacity: 0.8, marginTop: 4, color: "#7f1d1d" }}>
              Borra la sesión local y vuelve al login
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 16,
            padding: 16
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 12 }}>
            Estado app
          </Text>
          <Text style={{ marginBottom: 6 }}>Guías cercanos: OK</Text>
          <Text style={{ marginBottom: 6 }}>Reservas: OK</Text>
          <Text style={{ marginBottom: 6 }}>Pago test: OK</Text>
          <Text style={{ marginBottom: 6 }}>Webhook: OK</Text>
          <Text style={{ marginBottom: 6 }}>Login Mongo: OK</Text>
          <Text>Perfil Mongo editable: OK</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}