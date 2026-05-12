import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    back: "Volver",
    title: "Politica de privacidad",
    p1: "I GUIDE U recopila y utiliza informacion personal unicamente en la medida necesaria para operar la plataforma y brindar sus servicios.",
    p2: "La informacion que podes proporcionar incluye nombre, correo electronico, numero de telefono, datos de perfil y detalles relacionados con reservas.",
    p3: "Estos datos se utilizan para gestionar tu cuenta, facilitar la comunicacion entre viajeros y guias, procesar reservas y mejorar la experiencia dentro de la aplicacion.",
    p4: "Con tu autorizacion, la aplicacion puede utilizar informacion de ubicacion para mostrar guias cercanos y mejorar los resultados de busqueda.",
    p5: "Los pagos se procesan a traves de proveedores externos especializados como Stripe. I GUIDE U no almacena informacion completa de tarjetas de credito o debito.",
    p6: "La informacion puede compartirse unicamente cuando sea necesario para el funcionamiento del servicio, como en el caso de una reserva entre viajero y guia o con proveedores tecnologicos que operan la plataforma.",
    p7: "I GUIDE U no vende datos personales. Se aplican medidas razonables de seguridad para proteger la informacion, aunque ningun sistema es completamente seguro.",
    p8: "Los datos podran ser almacenados y procesados en distintos paises debido al caracter global de la plataforma.",
    p9: "Podes solicitar la actualizacion o eliminacion de tu informacion en la medida permitida por la ley.",
    p10: "El uso de la plataforma implica la aceptacion de esta politica de privacidad."
  },
  en: {
    back: "Back",
    title: "Privacy policy",
    p1: "I GUIDE U collects and uses personal information only to the extent necessary to operate the platform and provide its services.",
    p2: "The information you may provide includes name, email address, phone number, profile information and booking details.",
    p3: "This data is used to manage your account, facilitate communication between travelers and guides, process bookings and improve the in-app experience.",
    p4: "With your authorization, the app may use location information to show nearby guides and improve search results.",
    p5: "Payments are processed through specialized third-party providers such as Stripe. I GUIDE U does not store full credit or debit card information.",
    p6: "Information may only be shared when necessary for the operation of the service, such as during a booking between traveler and guide or with technology providers operating the platform.",
    p7: "I GUIDE U does not sell personal data. Reasonable security measures are applied to protect information, although no system is completely secure.",
    p8: "Data may be stored and processed in different countries due to the global nature of the platform.",
    p9: "You may request the update or deletion of your information to the extent permitted by law.",
    p10: "Use of the platform implies acceptance of this privacy policy."
  }
};

export default function PrivacyScreen() {
  const router = useRouter();

  const [lang, setLang] = useState<"es" | "en">("es");

  const t = copy[lang];

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((savedLang) => {
      if (savedLang === "es" || savedLang === "en") {
        setLang(savedLang);
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          gap: 18,
          paddingBottom: 40
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text
            style={{
              color: "#1f3b63",
              fontSize: 16,
              fontWeight: "700"
            }}
          >
            {t.back}
          </Text>
        </Pressable>

        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            color: "#111827"
          }}
        >
          {t.title}
        </Text>

        <View style={{ gap: 14 }}>
          <Text style={paragraph}>{t.p1}</Text>
          <Text style={paragraph}>{t.p2}</Text>
          <Text style={paragraph}>{t.p3}</Text>
          <Text style={paragraph}>{t.p4}</Text>
          <Text style={paragraph}>{t.p5}</Text>
          <Text style={paragraph}>{t.p6}</Text>
          <Text style={paragraph}>{t.p7}</Text>
          <Text style={paragraph}>{t.p8}</Text>
          <Text style={paragraph}>{t.p9}</Text>
          <Text style={paragraph}>{t.p10}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const paragraph = {
  fontSize: 17,
  color: "#374151",
  lineHeight: 28,
};