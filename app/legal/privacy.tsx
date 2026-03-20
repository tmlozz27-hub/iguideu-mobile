import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 18, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: "#1f3b63", fontSize: 16, fontWeight: "700" }}>
            Volver
          </Text>
        </Pressable>

        <Text style={{ fontSize: 32, fontWeight: "800", color: "#111827" }}>
          Política de privacidad
        </Text>

        <View style={{ gap: 14 }}>
          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            I GUIDE U recopila datos básicos de cuenta, reserva, ubicación y uso de la app para operar el servicio, mostrar guías relevantes y procesar reservas y pagos.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            La información personal se utiliza para autenticación, soporte, seguridad, mejora del producto y comunicación vinculada a la operación de la plataforma.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Los datos solo se comparten con terceros cuando es necesario para procesar pagos, operar servicios técnicos o cumplir obligaciones legales aplicables.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            I GUIDE U aplica medidas razonables de seguridad para proteger la información, aunque ningún sistema conectado a internet puede garantizar seguridad absoluta.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Al usar la app, el usuario acepta esta política de privacidad y el tratamiento de datos necesario para el funcionamiento del servicio.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
