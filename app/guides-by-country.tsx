import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "@/config/api";

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

  useEffect(() => {
    void loadGuides();
  }, [country, code]);

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
        filtered: filtered.length,
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
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>
          Guías en {country || code || "este país"}
        </Text>

        <Text style={{ marginTop: 8, fontSize: 15, color: "#475569" }}>
          Resultado: {guides.length} guía(s)
        </Text>

        {guides.length === 0 ? (
          <View
            style={{
              marginTop: 18,
              backgroundColor: "#ffffff",
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: "#e5e7eb"
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
              No encontramos guías para {country || code || "este país"}
            </Text>

            <Text style={{ marginTop: 8, fontSize: 14, color: "#64748b" }}>
              Total de guías cargados en app: {allGuidesCount}
            </Text>

            <Pressable
              onPress={() => router.back()}
              style={{
                marginTop: 14,
                backgroundColor: "#111827",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                alignSelf: "flex-start"
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "700" }}>Volver</Text>
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
                backgroundColor: "#ffffff",
                borderRadius: 18,
                padding: 18,
                borderWidth: 1,
                borderColor: "#e5e7eb"
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>
                {g.name || "Guía"}
              </Text>

              <Text style={{ marginTop: 4, color: "#475569" }}>
                {[g.city, g.country].filter(Boolean).join(", ") || "-"}
              </Text>

              <Text style={{ marginTop: 4, color: "#475569" }}>
                Idiomas: {Array.isArray(g.languages) ? g.languages.join(", ") : "-"}
              </Text>

              <Text style={{ marginTop: 4, color: "#475569" }}>
                Precio/hora: USD {g.priceHour ?? g.pricePerHour ?? "-"}
              </Text>

              <Text style={{ marginTop: 10, fontWeight: "700", color: "#0f172a" }}>
                Ver perfil
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}