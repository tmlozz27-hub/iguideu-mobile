import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "../../config/api";

type Guide = {
  _id: string;
  name?: string;
  city?: string;
  country?: string;
  languages?: string[];
  bio?: string;
};

export default function GuiaDetalleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = String(params.id || "");

  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<Guide | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/api/guides");

        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.items)
          ? (data as any).items
          : [];

        const found = list.find((g: Guide) => String(g._id) === id);

        setGuide(found || null);
      } catch (error) {
        console.log("ERROR loading guide", error);
        setGuide(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!guide) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se encontró el guía.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 40
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>
          {guide.name || "Guía"}
        </Text>

        <Text style={{ marginTop: 6, fontSize: 16, color: "#64748b" }}>
          {[guide.city, guide.country].filter(Boolean).join(", ")}
        </Text>

        <Text style={{ marginTop: 14, fontSize: 16, color: "#334155" }}>
          {guide.bio || "Guía personal disponible para viajeros."}
        </Text>

        <Text style={{ marginTop: 14, fontSize: 15, color: "#475569" }}>
          Idiomas: {guide.languages?.join(", ") || "-"}
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/reservas",
              params: { guideId: guide._id }
            })
          }
          style={{
            marginTop: 28,
            backgroundColor: "#0f9fb3",
            paddingVertical: 16,
            borderRadius: 18,
            alignItems: "center"
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