import React, { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../../config/api";

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
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);

        if (!token) {
          if (mounted) {
            setUser(null);
          }
          return;
        }

        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok || !data?.ok || !data?.user) {
          if (mounted) {
            setUser(null);
          }
          return;
        }

        if (mounted) {
          setUser(data.user);
          if (data.user?.email) {
            await AsyncStorage.setItem(USER_EMAIL_KEY, String(data.user.email));
          }
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

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
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
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
          <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 8 }}>
            Mi cuenta
          </Text>
          <Text style={{ marginBottom: 6 }}>
            Nombre: {loadingUser ? "Cargando..." : user?.name || "No disponible"}
          </Text>
          <Text style={{ marginBottom: 6 }}>
            Email: {loadingUser ? "Cargando..." : user?.email || "No disponible"}
          </Text>
          <Text style={{ marginBottom: 6 }}>
            Rol: {loadingUser ? "Cargando..." : user?.role || "traveler"}
          </Text>
          <Text style={{ opacity: 0.7 }}>Sesión activa</Text>
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
            <Text style={{ fontWeight: "700" }}>Editar perfil</Text>
            <Text style={{ opacity: 0.7, marginTop: 4 }}>
              Próximo paso: actualizar datos reales del usuario en Mongo
            </Text>
          </Pressable>

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
          <Text>Perfil Mongo: OK</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}