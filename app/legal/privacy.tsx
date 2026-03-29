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
            I GUIDE U utiliza los datos que ingresás para permitir el acceso a tu cuenta, gestionar reservas y mejorar la experiencia dentro de la plataforma.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            La información básica de contacto y perfil se almacena únicamente para el funcionamiento del servicio y para la comunicación necesaria entre viajeros y guías.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Tus datos no se comparten públicamente fuera de la plataforma, salvo en los casos necesarios para concretar una reserva o cumplir requisitos operativos del servicio.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Los pagos se procesan mediante servicios externos especializados. I GUIDE U no almacena en la app datos completos de tarjetas.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Podés solicitar actualizaciones o correcciones de tu información desde tu perfil, según las funciones disponibles en la aplicación.
          </Text>

          <Text style={{ fontSize: 17, color: "#374151", lineHeight: 28 }}>
            Al usar I GUIDE U, aceptás esta política de privacidad y el tratamiento de datos necesario para operar la plataforma.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}