import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    back: "Volver",
    title: "Terminos y condiciones",
    p1: "I GUIDE U es una plataforma digital que conecta viajeros con guias locales independientes que ofrecen experiencias personalizadas.",
    p2: "La plataforma no organiza, presta ni ejecuta directamente las experiencias. Los guias actuan como prestadores independientes y son los unicos responsables de los servicios que ofrecen.",
    p3: "Cada guia es responsable de la veracidad de su perfil, del cumplimiento de las leyes locales, de la seguridad de la actividad y de la calidad del servicio brindado.",
    p4: "Al realizar una reserva, el viajero acepta el precio informado y el guia se compromete a brindar el servicio en las condiciones publicadas.",
    p5: "Politica de cancelacion: las cancelaciones realizadas con mas de 24 horas de anticipacion podran recibir un reembolso completo. Las cancelaciones dentro de las 24 horas previas no son reembolsables. Si el guia cancela, el viajero recibira un reembolso completo.",
    p6: "En caso de no presentacion del viajero en el horario acordado, la reserva podra considerarse no show y no correspondera reembolso.",
    p7: "Los gastos adicionales como entradas, transporte o consumos no estan incluidos salvo indicacion expresa del guia.",
    p8: "I GUIDE U actua unicamente como intermediario tecnologico. No garantiza la calidad, seguridad o legalidad de las experiencias ofrecidas.",
    p9: "El usuario participa en las experiencias bajo su propia responsabilidad y criterio.",
    p10: "El uso de la plataforma implica la aceptacion de estos terminos."
  },
  en: {
    back: "Back",
    title: "Terms and conditions",
    p1: "I GUIDE U is a digital platform that connects travelers with independent local guides offering personalized experiences.",
    p2: "The platform does not organize, provide or directly operate the experiences. Guides act as independent providers and are solely responsible for the services they offer.",
    p3: "Each guide is responsible for the accuracy of their profile, compliance with local laws, activity safety and the quality of the service provided.",
    p4: "By making a booking, the traveler accepts the listed price and the guide agrees to provide the service under the published conditions.",
    p5: "Cancellation policy: cancellations made more than 24 hours in advance may receive a full refund. Cancellations within the previous 24 hours are non-refundable. If the guide cancels, the traveler will receive a full refund.",
    p6: "If the traveler does not show up at the agreed time, the booking may be considered a no-show and no refund will apply.",
    p7: "Additional expenses such as tickets, transportation or personal consumption are not included unless expressly stated by the guide.",
    p8: "I GUIDE U acts solely as a technology intermediary. It does not guarantee the quality, safety or legality of the experiences offered.",
    p9: "Users participate in experiences under their own responsibility and judgment.",
    p10: "Use of the platform implies acceptance of these terms."
  }
};

export default function TermsScreen() {
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