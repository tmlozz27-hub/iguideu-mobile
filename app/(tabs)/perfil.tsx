import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 16 }}>Perfil</Text>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 6 }}>Tommy</Text>
          <Text style={{ opacity: 0.75, marginBottom: 4 }}>Viajero</Text>
          <Text style={{ opacity: 0.75 }}>test+frontend@iguideu.com</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 12 }}>Resumen</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10
            }}
          >
            <Text style={{ opacity: 0.8 }}>Reservas</Text>
            <Text style={{ fontWeight: "700" }}>Activas</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10
            }}
          >
            <Text style={{ opacity: 0.8 }}>Pagos</Text>
            <Text style={{ fontWeight: "700" }}>Test OK</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ opacity: 0.8 }}>Ubicación</Text>
            <Text style={{ fontWeight: "700" }}>Geo OK</Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 12 }}>Cuenta</Text>

          <Pressable
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10
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
              borderRadius: 12,
              padding: 14,
              marginBottom: 10
            }}
          >
            <Text style={{ fontWeight: "700" }}>Métodos de pago</Text>
            <Text style={{ opacity: 0.7, marginTop: 4 }}>
              Próximo paso: Stripe real
            </Text>
          </Pressable>

          <Pressable
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 14
            }}
          >
            <Text style={{ fontWeight: "700" }}>Seguridad</Text>
            <Text style={{ opacity: 0.7, marginTop: 4 }}>
              Próximo paso: login y autenticación real
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            padding: 16
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 12 }}>Estado app</Text>
          <Text style={{ marginBottom: 6 }}>Guías cercanos: OK</Text>
          <Text style={{ marginBottom: 6 }}>Reservas: OK</Text>
          <Text style={{ marginBottom: 6 }}>Pago test: OK</Text>
          <Text>Webhook: OK</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}