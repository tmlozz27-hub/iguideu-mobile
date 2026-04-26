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
            I GUIDE U recopila y utiliza información personal únicamente en la medida necesaria para operar la plataforma y brindar sus servicios.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            La información que podés proporcionar incluye nombre, correo electrónico, número de teléfono, datos de perfil y detalles relacionados con reservas.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Estos datos se utilizan para gestionar tu cuenta, facilitar la comunicación entre viajeros y guías, procesar reservas y mejorar la experiencia dentro de la aplicación.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Con tu autorización, la aplicación puede utilizar información de ubicación para mostrar guías cercanos y mejorar los resultados de búsqueda.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Los pagos se procesan a través de proveedores externos especializados como Stripe. I GUIDE U no almacena información completa de tarjetas de crédito o débito.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            La información puede compartirse únicamente cuando sea necesario para el funcionamiento del servicio, como en el caso de una reserva entre viajero y guía o con proveedores tecnológicos que operan la plataforma.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            I GUIDE U no vende datos personales. Se aplican medidas razonables de seguridad para proteger la información, aunque ningún sistema es completamente seguro.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Los datos podrán ser almacenados y procesados en distintos países debido al carácter global de la plataforma.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Podés solicitar la actualización o eliminación de tu información en la medida permitida por la ley.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            El uso de la plataforma implica la aceptación de esta política de privacidad.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
