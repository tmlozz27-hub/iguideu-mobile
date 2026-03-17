import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_BASE } from "../config/api";

type GuideItem = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  title?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  location?: string;
  languages?: string[];
  about?: string;
  bio?: string;
  pricePerHour?: number;
  priceHour?: number;
};

export default function GuidesByCountryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ country?: string; code?: string }>();
  const country = typeof params.country === "string" ? params.country : "";
  const code = typeof params.code === "string" ? params.code : "";

  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<GuideItem[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/api/guides`);
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.guides)
          ? data.guides
          : Array.isArray(data?.items)
          ? data.items
          : [];

        const wantedCountry = country.trim().toLowerCase();
        const wantedCode = code.trim().toLowerCase();

        const filtered = list.filter((g: GuideItem) => {
          const gCountry = String(g.country || "").trim().toLowerCase();
          const gCode = String(g.countryCode || "").trim().toLowerCase();

          return (
            gCountry === wantedCountry ||
            gCountry.includes(wantedCountry) ||
            gCode === wantedCode
          );
        });

        if (!active) return;
        setGuides(filtered);
      } catch {
        if (!active) return;
        setGuides([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [country, code]);

  const title = useMemo(() => {
    if (country) return country;
    if (code) return code;
    return "País";
  }, [country, code]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
          backgroundColor: "#ffffff"
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>
          Guías en {title}
        </Text>

        <Text style={{ marginTop: 8, fontSize: 15, color: "#475569" }}>
          Seleccioná un guía para ver su perfil y continuar con la reserva.
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12, fontSize: 15, color: "#64748b" }}>
            Cargando guías...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 28
          }}
        >
          {guides.length === 0 ? (
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 18,
                padding: 18,
                borderWidth: 1,
                borderColor: "#e5e7eb"
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
                No hay guías cargados para {title}
              </Text>
              <Text style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                La pantalla ya está lista; a la tarde en casa probamos el flujo completo.
              </Text>
            </View>
          ) : null}

          {guides.map((g, i) => {
            const guideId = g._id || g.id || `guide-${i}`;
            const guideName = g.name || g.fullName || g.title || "Guía";
            const guideCity = g.city || g.location || "";
            const guideBio = g.about || g.bio || "Guía personal disponible para viajeros.";
            const price = Number(g.priceHour ?? g.pricePerHour ?? 0);

            return (
              <Pressable
                key={String(guideId)}
                onPress={() =>
                  router.push({
                    pathname: "/guia-detalle",
                    params: { id: String(guideId) }
                  })
                }
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 18,
                  padding: 18,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb"
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>
                  {guideName}
                </Text>

                {!!guideCity ? (
                  <Text style={{ marginTop: 4, fontSize: 14, color: "#64748b" }}>
                    {guideCity}
                  </Text>
                ) : null}

                <Text style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
                  {guideBio}
                </Text>

                {Array.isArray(g.languages) && g.languages.length > 0 ? (
                  <Text style={{ marginTop: 8, fontSize: 14, color: "#0f766e" }}>
                    Idiomas: {g.languages.join(", ")}
                  </Text>
                ) : null}

                {price > 0 ? (
                  <Text style={{ marginTop: 8, fontSize: 14, fontWeight: "700", color: "#0f172a" }}>
                    USD {price} / hora
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}