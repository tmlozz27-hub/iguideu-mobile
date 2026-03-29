import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { apiGet } from "@/config/api";

type Guide = {
  _id?: string;
  id?: string;
  name?: string;
  country?: string;
  city?: string;
  languages?: string[];
  rating?: number;
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
    loadGuides();
  }, [loadGuides]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#eaf4ff" }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ backgroundColor: "#15539A", borderRadius: 24, padding: 18 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#ffffff" }}>
          {"Gu\u00EDas"}
        </Text>

        <Text style={{ marginTop: 8, fontSize: 15, color: "#dbeafe" }}>
          {"Abr\u00ED perfiles reales, revis\u00E1 tarifas y segu\u00ED directo a reserva."}
        </Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <Pressable
            onPress={() => router.push("/guias-cercanos")}
            style={{ flex: 1, backgroundColor: "#27D3BE", paddingVertical: 14, borderRadius: 14, alignItems: "center" }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "800" }}>
              {"Gu\u00EDas cercanos"}
            </Text>
          </Pressable>

          <Pressable
            onPress={loadGuides}
            style={{ flex: 1, backgroundColor: "#ffffff", paddingVertical: 14, borderRadius: 14, alignItems: "center" }}
          >
            <Text style={{ color: "#15539A", fontWeight: "800" }}>
              Recargar
            </Text>
          </Pressable>
        </View>
      </View>

      {loading && (
        <View style={{ paddingTop: 30 }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && guides.length === 0 && (
        <View style={{ marginTop: 16, backgroundColor: "#ffffff", borderRadius: 18, padding: 18 }}>
          <Text>No hay guías para mostrar.</Text>
        </View>
      )}

      {guides.map((guide, index) => {
        const guideId = guide._id || guide.id || String(index);
        const location = [guide.city, guide.country].filter(Boolean).join(", ");
        const languages = Array.isArray(guide.languages) && guide.languages.length > 0
          ? guide.languages.join(", ")
          : "A confirmar";

        return (
          <Pressable
            key={guideId}
            onPress={() => router.push({ pathname: "/guia-detalle", params: { guideId } })}
            style={{ marginTop: 16, borderRadius: 18, padding: 18, backgroundColor: "#ffffff" }}
          >
            <Text style={{ fontSize: 22, fontWeight: "800" }}>
              {guide.name || "Guía"}
            </Text>

            <Text>{location || "Ubicación a confirmar"}</Text>
            <Text>Idiomas: {languages}</Text>
            <Text>Rating: {guide.rating ?? "-"}</Text>
            <Text>Jornada 8h: {money(guide.priceDay)}</Text>
            <Text>24 horas: {money(guide.price24h)}</Text>

            <Text style={{ marginTop: 10 }}>
              {guide.bio || "Guía local disponible para experiencias personalizadas."}
            </Text>

            <View style={{ marginTop: 12, backgroundColor: "#0f172a", padding: 10, borderRadius: 10 }}>
              <Text style={{ color: "#ffffff", fontWeight: "800" }}>
                Ver perfil
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}