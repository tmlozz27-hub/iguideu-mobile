import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "../config/api";

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
};

export default function GuiaDetalleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    guideId?: string;
    id?: string;
    _id?: string;
    guide?: string;
  }>();

  const guideId = useMemo(() => {
    const raw =
      params.guideId ||
      params.id ||
      params._id ||
      params.guide ||
      "";

    return String(Array.isArray(raw) ? raw[0] : raw).trim();
  }, [params]);

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadGuide();
  }, [guideId]);

  async function loadGuide() {
    try {
      setLoading(true);

      console.log("GUIA_DETALLE_PARAMS", params);
      console.log("GUIA_DETALLE_ID", guideId);

      if (!guideId) {
        console.log("GUIA_DETALLE_NO_ID");
        setGuide(null);
        return;
      }

      const data = await apiGet("/api/guides");
      console.log("GUIA_DETALLE_GUIDES_RAW", data);

      const list =
        (data as any)?.items ||
        (data as any)?.guides ||
        (data as any)?.data ||
        data ||
        [];

      const guidesArray = Array.isArray(list) ? list : [];

      const found =
        guidesArray.find((g: any) => String(g?._id || "").trim() === guideId) ||
        guidesArray.find((g: any) => String(g?.id || "").trim() === guideId) ||
        null;

      console.log("GUIA_DETALLE_FOUND", found);

      setGuide(found);
    } catch (error) {
      console.log("ERROR loadGuide()", error);
      setGuide(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>No se encontró el guía.</Text>
        <Text style={{ marginTop: 8, color: "#6b7280", textAlign: "center" }}>
          guideId: {guideId || "-"}
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            backgroundColor: "#111827",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "700" }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>{guide.name || "Guía"}</Text>
      <Text>{[guide.city, guide.country].filter(Boolean).join(", ") || "-"}</Text>
      <Text>Idiomas: {Array.isArray(guide.languages) ? guide.languages.join(", ") : "-"}</Text>
      <Text>Rating: {guide.rating ?? "-"}</Text>
      <Text>Precio/hora: USD {guide.priceHour ?? guide.pricePerHour ?? "-"}</Text>
      <Text>Precio/día: USD {guide.priceDay ?? "-"}</Text>
      <Text>Precio/24h: USD {guide.price24h ?? guide.priceFullDay24h ?? "-"}</Text>
      <Text>{guide.bio || "Sin descripción."}</Text>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(tabs)/reservas",
            params: { guideId: guide._id || guide.id || guideId },
          })
        }
        style={{
          marginTop: 12,
          backgroundColor: "#111827",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "800" }}>Solicitar servicio</Text>
      </Pressable>
    </ScrollView>
  );
}