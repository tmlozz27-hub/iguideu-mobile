import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet } from "@/config/api";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    title: "Guias",
    subtitle: "Abri perfiles reales, revisa tarifas y segui directo a reserva.",
    nearby: "Guias cercanos",
    reload: "Recargar",
    byCountry: "Buscar por pais",
    empty: "No hay guias para mostrar.",
    confirm: "A confirmar",
    guide: "Guia",
    locationConfirm: "Ubicacion a confirmar",
    languages: "Idiomas",
    rating: "Rating",
    day: "Jornada 8h",
    hour: "Por hora",
    defaultBio: "Guia local disponible para experiencias personalizadas.",
    viewProfile: "Ver perfil"
  },
  en: {
    title: "Guides",
    subtitle: "Open real profiles, review rates, and continue directly to booking.",
    nearby: "Nearby guides",
    reload: "Reload",
    byCountry: "Search by country",
    empty: "No guides to show.",
    confirm: "To be confirmed",
    guide: "Guide",
    locationConfirm: "Location to be confirmed",
    languages: "Languages",
    rating: "Rating",
    day: "8h day",
    hour: "Per hour",
    defaultBio: "Local guide available for personalized experiences.",
    viewProfile: "View profile"
  }
};

type Guide = {
  _id?: string;
  id?: string;
  name?: string;
  country?: string;
  city?: string;
  languages?: string[];
  rating?: number;
  pricePerHour?: number;
  priceHour?: number;
  priceDay?: number;
  price24h?: number;
  bio?: string;
};

function money(value?: number) {
  if (!value || value <= 0) return "-";
  return `USD ${value}`;
}

export default function GuiasScreen() {
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");
  const t = copy[lang];

  const loadLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);
    if (savedLang === "es" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  const loadGuides = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await apiGet("/api/guides")) as any;

      const list =
        Array.isArray(data) ? data :
        Array.isArray(data?.items) ? data.items :
        Array.isArray(data?.guides) ? data.guides :
        Array.isArray(data?.data) ? data.data :
        [];

      setGuides(list);
    } catch {
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLang();
    loadGuides();
  }, [loadLang, loadGuides]);

  useFocusEffect(
    useCallback(() => {
      loadLang();
    }, [loadLang])
  );

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
      }}
      style={{ flex: 1, backgroundColor: "#76A9E8" }}
      resizeMode="cover"
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.45)",
            borderRadius: 28,
            padding: 20
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#15539A" }}>
            {t.title}
          </Text>

          <Text style={{ marginTop: 8, fontSize: 15, color: "#173B6B", lineHeight: 22 }}>
            {t.subtitle}
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Pressable
              onPress={() => router.push("/guias-cercanos")}
              style={{
                flex: 1,
                backgroundColor: "#1CC9B7",
                paddingVertical: 15,
                borderRadius: 18,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "800" }}>
                {t.nearby}
              </Text>
            </Pressable>

            <Pressable
              onPress={loadGuides}
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                paddingVertical: 15,
                borderRadius: 18,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#15539A", fontWeight: "800" }}>
                {t.reload}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/guides-by-country")}
            style={{
              marginTop: 10,
              backgroundColor: "rgba(255,255,255,0.35)",
              paddingVertical: 15,
              borderRadius: 18,
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#15539A", fontWeight: "800" }}>
              {t.byCountry}
            </Text>
          </Pressable>
        </View>

        {loading && (
          <View style={{ paddingTop: 32 }}>
            <ActivityIndicator size="large" color="#15539A" />
          </View>
        )}

        {!loading && guides.length === 0 && (
          <View
            style={{
              marginTop: 16,
              borderRadius: 22,
              padding: 18,
              backgroundColor: "rgba(255,255,255,0.35)"
            }}
          >
            <Text style={{ color: "#173B6B" }}>
              {t.empty}
            </Text>
          </View>
        )}

        {guides.map((guide, index) => {
          const guideId = guide._id || guide.id || String(index);
          const location = [guide.city, guide.country].filter(Boolean).join(", ");
          const languages = Array.isArray(guide.languages) && guide.languages.length > 0
            ? guide.languages.join(", ")
            : t.confirm;

          return (
            <Pressable
              key={guideId}
              onPress={() => router.push({ pathname: "/guia-detalle", params: { guideId } })}
              style={{
                marginTop: 16,
                borderRadius: 24,
                padding: 18,
                backgroundColor: "rgba(255,255,255,0.38)"
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "800", color: "#15539A" }}>
                {guide.name || t.guide}
              </Text>

              <Text style={{ marginTop: 8, color: "#173B6B" }}>
                {location || t.locationConfirm}
              </Text>

              <Text style={{ marginTop: 4, color: "#173B6B" }}>
                {t.languages}: {languages}
              </Text>

              <Text style={{ marginTop: 4, color: "#173B6B" }}>
                {t.rating}: {guide.rating ?? "-"}
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 16, padding: 12 }}>
                  <Text style={{ color: "#173B6B", fontSize: 13 }}>
                    {t.day}
                  </Text>
                  <Text style={{ color: "#15539A", fontWeight: "800", fontSize: 16 }}>
                    {money(guide.priceDay)}
                  </Text>
                </View>

                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 16, padding: 12 }}>
                  <Text style={{ color: "#173B6B", fontSize: 13 }}>
                    {t.hour}
                  </Text>
                  <Text style={{ color: "#15539A", fontWeight: "800", fontSize: 16 }}>
                    {money(guide.priceHour ?? guide.pricePerHour)}
                  </Text>
                </View>
              </View>

              <Text style={{ marginTop: 14, color: "#173B6B", lineHeight: 22 }}>
                {guide.bio || t.defaultBio}
              </Text>

              <View
                style={{
                  marginTop: 14,
                  backgroundColor: "#1CC9B7",
                  paddingVertical: 13,
                  borderRadius: 16,
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#ffffff", fontWeight: "800" }}>
                  {t.viewProfile}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}