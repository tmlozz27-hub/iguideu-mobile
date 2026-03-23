import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function TermsScreen() {
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
          Términos y condiciones
        </Text>

        <View style={{ gap: 14 }}>
          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            I GUIDE U conecta viajeros con guías locales independientes para facilitar reservas y experiencias personalizadas.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Cada guía publica su perfil, disponibilidad, idiomas, tarifa y condiciones de servicio bajo su propia responsabilidad.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Antes de confirmar una reserva, el viajero debe revisar cuidadosamente la tarifa, duración, fecha, punto de encuentro y cualquier condición adicional informada por el guía.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Los gastos extra, entradas, transporte, comidas u otros costos no están incluidos salvo que se indique expresamente en la propuesta del guía.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Las cancelaciones, reprogramaciones y solicitudes especiales deben realizarse con la mayor anticipación posible para facilitar la coordinación entre las partes.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            I GUIDE U actúa como plataforma de conexión y gestión de reservas, pero no reemplaza el criterio personal del viajero al momento de elegir un guía o contratar un servicio.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Al continuar usando la app, aceptás estas condiciones generales de uso de la plataforma.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}