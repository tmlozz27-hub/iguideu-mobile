import React from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

export default function Profile() {
  const router = useRouter();

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
          <Text style={{ marginBottom: 6 }}>Rol: Traveler</Text>
          <Text style={{ opacity: 0.7 }}>Sesión local activa</Text>
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
              Próximo paso: conectar datos reales del usuario
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
              Login mínimo ya conectado al backend
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
          <Text style={{ marginBottom: 6 }}>Login backend: OK</Text>
          <Text>Logout local: OK</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}