import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet } from "@/config/api";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    loading: "Cargando guías",
    titlePrefix: "Guías en",
    thisCountry: "este país",
    result: "Resultado",
    guideSingular: "guía",
    guidePlural: "guías",
    noGuides: "No encontramos guías para",
    totalLoaded: "Total de guías cargados en app",
    back: "Volver",
    guide: "Guía",
    languages: "Idiomas",
    priceHour: "Precio/hora",
    viewProfile: "Ver perfil",
  },
  en: {
    loading: "Loading guides",
    titlePrefix: "Guides in",
    thisCountry: "this country",
    result: "Result",
    guideSingular: "guide",
    guidePlural: "guides",
    noGuides: "We couldn’t find guides for",
    totalLoaded: "Total guides loaded in app",
    back: "Back",
    guide: "Guide",
    languages: "Languages",
    priceHour: "Price/hour",
    viewProfile: "View profile",
  },
};

type Guide = {
  _id?: string;
  id?: string;
  name?: string;
  country?: string;
  countryCode?: string;
  code?: string;
  city?: string;
  languages?: string[];
  rating?: number;
  pricePerHour?: number;
  priceHour?: number;
  bio?: string;
};

function normalize(value: unknown) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export default function GuidesByCountryScreen() {
  console.log("GUIDES BY COUNTRY SCREEN ACTIVE");

  const router = useRouter();
  const params = useLocalSearchParams<{ country?: string; code?: string }>();

  const country = useMemo(() => {
    const raw = params.country;
    return String(Array.isArray(raw) ? raw[0] : raw || "").trim();
  }, [params.country]);

  const code = useMemo(() => {
    const raw = params.code;
    return String(Array.isArray(raw) ? raw[0] : raw || "").trim().toUpperCase();
  }, [params.code]);

  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [allGuidesCount, setAllGuidesCount] = useState(0);
  const [lang, setLang] = useState<"es" | "en">("es");
  const t = copy[lang];

  const loadLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);
    if (savedLang === "es" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    loadLang();
    void loadGuides();
  }, [country, code, loadLang]);

  useFocusEffect(
    useCallback(() => {
      loadLang();
    }, [loadLang])
  );

  async function loadGuides() {
    try {
      setLoading(true);

      const data = await apiGet("/api/guides");

      const list =
        (data as any)?.items ||
        (data as any)?.guides ||
        (data as any)?.data ||
        data ||
        [];

      const arr = Array.isArray(list) ? list : [];
      setAllGuidesCount(arr.length);

      const filtered = arr.filter((g: any) => {
        const guideCountry = normalize(g?.country);
        const guideCountryCode = String(g?.countryCode || g?.code || "").trim().toUpperCase();

        const sameCountry =
          !!country &&
          !!guideCountry &&
          (guideCountry === normalize(country) ||
            guideCountry.includes(normalize(country)) ||
            normalize(country).includes(guideCountry));

        const sameCode = !!code && !!guideCountryCode && guideCountryCode === code;

        return sameCountry || sameCode;
      });

      console.log("GUIDES_BY_COUNTRY_FILTER", {
        country,
        code,
        total: arr.length,
        filtered: filtered.length
      });

      setGuides(filtered);
    } catch (error) {
      console.log("ERROR guides-by-country", error);
      setGuides([]);
      setAllGuidesCount(0);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
          }}
          style={{ flex: 1, backgroundColor: "#76A9E8" }}
          resizeMode="cover"
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#15539A" />
            <Text style={{ marginTop: 12, color: "#15539A", fontWeight: "800", fontSize: 18 }}>
              {t.loading}
            </Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
        }}
        style={{ flex: 1, backgroundColor: "#76A9E8" }}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.48)",
              borderRadius: 24,
              padding: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)"
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#15539A" }}>
              {t.titlePrefix} {country || code || t.thisCountry}
            </Text>

            <Text style={{ marginTop: 8, fontSize: 15, color: "#173B6B", lineHeight: 22 }}>
              {t.result}: {guides.length} {guides.length === 1 ? t.guideSingular : t.guidePlural}
            </Text>
          </View>

          {guides.length === 0 ? (
            <View
              style={{
                marginTop: 18,
                backgroundColor: "rgba(255,255,255,0.38)",
                borderRadius: 22,
                padding: 18,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)"
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#15539A" }}>
                {t.noGuides} {country || code || t.thisCountry}
              </Text>

              <Text style={{ marginTop: 8, fontSize: 14, color: "#173B6B" }}>
                {t.totalLoaded}: {allGuidesCount}
              </Text>

              <Pressable
                onPress={() => router.back()}
                style={{
                  marginTop: 14,
                  backgroundColor: "#1CC9B7",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 14,
                  alignSelf: "flex-start"
                }}
              >
                <Text style={{ color: "#ffffff", fontWeight: "700" }}>{t.back}</Text>
              </Pressable>
            </View>
          ) : null}

          {guides.map((g, index) => {
            const guideId = g._id || g.id || String(index);

            return (
              <Pressable
                key={guideId}
                onPress={() =>
                  router.push({
                    pathname: "/guia-detalle",
                    params: { guideId }
                  })
                }
                style={{
                  marginTop: 14,
                  backgroundColor: "rgba(255,255,255,0.38)",
                  borderRadius: 22,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.18)"
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "800", color: "#15539A" }}>
                  {g.name || t.guide}
                </Text>

                <Text style={{ marginTop: 4, color: "#173B6B" }}>
                  {[g.city, g.country].filter(Boolean).join(", ") || "-"}
                </Text>

                <Text style={{ marginTop: 4, color: "#173B6B" }}>
                  {t.languages}: {Array.isArray(g.languages) ? g.languages.join(", ") : "-"}
                </Text>

                <Text style={{ marginTop: 4, color: "#173B6B" }}>
                  {t.priceHour}: USD {g.priceHour ?? g.pricePerHour ?? "-"}
                </Text>

                <Text style={{ marginTop: 12, fontWeight: "800", color: "#15539A" }}>
                  {t.viewProfile}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}