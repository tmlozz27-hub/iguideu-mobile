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
            I GUIDE U es una plataforma digital que conecta viajeros con guías locales independientes que ofrecen experiencias personalizadas.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            La plataforma no organiza, presta ni ejecuta directamente las experiencias. Los guías actúan como prestadores independientes y son los únicos responsables de los servicios que ofrecen.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Cada guía es responsable de la veracidad de su perfil, del cumplimiento de las leyes locales, de la seguridad de la actividad y de la calidad del servicio brindado.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Al realizar una reserva, el viajero acepta el precio informado y el guía se compromete a brindar el servicio en las condiciones publicadas.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Política de cancelación: las cancelaciones realizadas con más de 24 horas de anticipación podrán recibir un reembolso completo. Las cancelaciones dentro de las 24 horas previas no son reembolsables. Si el guía cancela, el viajero recibirá un reembolso completo.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            En caso de no presentación del viajero en el horario acordado, la reserva podrá considerarse no show y no corresponderá reembolso.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Los gastos adicionales como entradas, transporte o consumos no están incluidos salvo indicación expresa del guía.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            I GUIDE U actúa únicamente como intermediario tecnológico. No garantiza la calidad, seguridad o legalidad de las experiencias ofrecidas.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            El usuario participa en las experiencias bajo su propia responsabilidad y criterio.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            El uso de la plataforma implica la aceptación de estos términos.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}