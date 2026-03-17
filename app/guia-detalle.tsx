import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "../config/api";

type Guide = {
  _id: string;
  id?: string;
  name?: string;
  city?: string;
  country?: string;
  languages?: string[];
  bio?: string;
  rating?: number;
  pricePerHour?: number;
  priceHour?: number;
  priceDay?: number;
  price24h?: number;
  priceFullDay24h?: number;
  avatarUrl?: string;
  distanceKm?: number;
};

export default function GuiaDetalleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ guideId?: string; id?: string }>();
  const guideId =
    typeof params.guideId === "string" && params.guideId.trim()
      ? params.guideId.trim()
      : typeof params.id === "string"
      ? params.id.trim()
      : "";

  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<Guide | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const data = await apiGet("/api/guides");
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.items)
          ? (data as any).items
          : Array.isArray((data as any)?.value)
          ? (data as any).value
          : [];

        const found =
          list.find((g: any) => String(g?._id || "") === guideId) ||
          list.find((g: any) => String(g?.id || "") === guideId) ||
          null;

        setGuide(found);
      } catch (error) {
        console.log("ERROR loading guide detail", error);
        setGuide(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [guideId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!guide) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a", textAlign: "center" }}>
          No se encontró el guía.
        </Text>
        <Text style={{ marginTop: 8, fontSize: 14, color: "#64748b", textAlign: "center" }}>
          guideId: {guideId || "-"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 40,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>
          {guide.name || "Guía"}
        </Text>

        <Text style={{ marginTop: 6, fontSize: 16, color: "#64748b" }}>
          {[guide.city, guide.country].filter(Boolean).join(", ") || "-"}
        </Text>

        <Text style={{ marginTop: 14, fontSize: 15, color: "#475569" }}>
          Idiomas: {Array.isArray(guide.languages) && guide.languages.length > 0 ? guide.languages.join(", ") : "-"}
        </Text>

        <Text style={{ marginTop: 14, fontSize: 15, color: "#475569" }}>
          Rating: {guide.rating ?? "-"}
        </Text>

        <Text style={{ marginTop: 14, fontSize: 15, color: "#475569" }}>
          Precio/hora: USD {guide.priceHour ?? guide.pricePerHour ?? "-"}
        </Text>

        <Text style={{ marginTop: 14, fontSize: 16, color: "#334155" }}>
          {guide.bio || "Guía personal disponible para viajeros."}
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/reservas",
              params: { guideId: guide._id },
            })
          }
          style={{
            marginTop: 28,
            backgroundColor: "#0f9fb3",
            paddingVertical: 16,
            borderRadius: 18,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "800" }}>
            Solicitar servicio
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}