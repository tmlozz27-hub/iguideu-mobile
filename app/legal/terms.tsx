import React from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
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
            El usuario acepta proporcionar información verdadera, utilizar la plataforma de forma lícita y respetar a otros usuarios durante todo el proceso de búsqueda, reserva y pago.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Los guías son responsables por la información publicada en sus perfiles, sus tarifas, su disponibilidad y la prestación efectiva del servicio acordado con el viajero.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            I GUIDE U puede aplicar comisiones por intermediación y podrá actualizar funciones, tarifas, políticas operativas y medidas de seguridad cuando sea necesario.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            El uso continuado de la app implica la aceptación de estos términos y de la política de privacidad vigente.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}