import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { apiGet } from "../../config/api";

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
  priceFullDay24h?: number;
  bio?: string;
  avatarUrl?: string;
  distanceKm?: number;
};

export default function GuiasScreen() {
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGuides = useCallback(async () => {
    try {
      setLoading(true);

      const data = (await apiGet("/api/guides")) as any;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setGuides(list);
      console.log("GUIDES_LIST_OK", { count: list.length });
    } catch (error: any) {
      console.log("ERROR loadGuides()", error);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Guías</Text>

      <Pressable
        onPress={() => router.push("/guias-cercanos")}
        style={{
          backgroundColor: "#0f172a",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "700" }}>
          Ver guías cercanos en mapa
        </Text>
      </Pressable>

      <Pressable
        onPress={loadGuides}
        style={{
          backgroundColor: "#ffffff",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          alignSelf: "flex-start",
          borderWidth: 1,
          borderColor: "#d1d5db",
        }}
      >
        <Text style={{ color: "#111827", fontWeight: "700" }}>Recargar guías</Text>
      </Pressable>

      {loading ? <ActivityIndicator size="large" /> : null}

      {!loading && guides.length === 0 ? (
        <View style={{ paddingVertical: 20 }}>
          <Text>No hay guías para mostrar.</Text>
        </View>
      ) : null}

      {guides.map((guide, index) => {
        const guideId = guide._id || guide.id || String(index);

        return (
          <Pressable
            key={guideId}
            onPress={() =>
              router.push({
                pathname: "/guia-detalle",
                params: {
                  guideId,
                },
              })
            }
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 14,
              padding: 14,
              gap: 6,
              backgroundColor: "#ffffff",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>{guide.name || "Guía"}</Text>
            <Text>{[guide.city, guide.country].filter(Boolean).join(", ") || "-"}</Text>
            <Text>Idiomas: {Array.isArray(guide.languages) ? guide.languages.join(", ") : "-"}</Text>
            <Text>Rating: {guide.rating ?? "-"}</Text>
            <Text>Precio/hora: USD {guide.priceHour ?? guide.pricePerHour ?? "-"}</Text>
            <Text>{guide.bio || "Sin descripción."}</Text>
            <Text style={{ marginTop: 6, fontWeight: "700" }}>Ver perfil</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
