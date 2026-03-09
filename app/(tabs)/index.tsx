import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", marginBottom: 8 }}>I GUIDE U</Text>
        <Text style={{ fontSize: 18, opacity: 0.75, marginBottom: 20 }}>
          Encontrá guías locales, reservá y pagá desde la app.
        </Text>

        <Pressable
          onPress={() => router.push("/(tabs)/guias")}
          style={{
            borderWidth: 1,
            borderRadius: 18,
            padding: 18,
            marginBottom: 14
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 6 }}>Guías cercanos</Text>
          <Text style={{ opacity: 0.75 }}>
            Ver guías ordenados por distancia desde tu ubicación.
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/reservas")}
          style={{
            borderWidth: 1,
            borderRadius: 18,
            padding: 18,
            marginBottom: 14
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 6 }}>Reservar ahora</Text>
          <Text style={{ opacity: 0.75 }}>
            Creá una reserva, pagá en test y revisá el estado.
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/perfil")}
          style={{
            borderWidth: 1,
            borderRadius: 18,
            padding: 18,
            marginBottom: 20
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 6 }}>Mi perfil</Text>
          <Text style={{ opacity: 0.75 }}>
            Estado de cuenta, pagos y próximos pasos de la app.
          </Text>
        </Pressable>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 18,
            padding: 18,
            marginBottom: 14
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 12 }}>Estado del sistema</Text>
          <Text style={{ marginBottom: 6 }}>Guías cercanos: OK</Text>
          <Text style={{ marginBottom: 6 }}>Geo: OK</Text>
          <Text style={{ marginBottom: 6 }}>Reservas: OK</Text>
          <Text style={{ marginBottom: 6 }}>Pago test: OK</Text>
          <Text>Webhook: OK</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 18,
            padding: 18
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 12 }}>Siguiente fase</Text>
          <Text style={{ marginBottom: 6 }}>1. Encajar diseño final pantalla por pantalla</Text>
          <Text style={{ marginBottom: 6 }}>2. Detalle de guía</Text>
          <Text style={{ marginBottom: 6 }}>3. Reserva desde guía</Text>
          <Text style={{ marginBottom: 6 }}>4. Stripe real</Text>
          <Text>5. Login y perfil real</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}