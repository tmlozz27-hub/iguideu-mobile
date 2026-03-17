import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "../config/api";

type Guide = {
  _id: string;
  name?: string;
  city?: string;
  country?: string;
  languages?: string[];
  bio?: string;
};

export default function GuidesCountryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const country = String(params.country || "").trim();

  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/api/guides");

        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.items)
          ? (data as any).items
          : [];

        const filtered = list.filter((g: Guide) =>
          String(g.country || "").trim().toLowerCase() === country.toLowerCase()
        );

        setGuides(filtered);
      } catch (error) {
        console.log("ERROR loading guides by country", error);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [country]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 40,
          gap: 12
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700" }}>
          Guías en {country || "este país"}
        </Text>

        {loading ? <ActivityIndicator size="large" /> : null}

        {!loading && guides.length === 0 ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#ffffff"
            }}
          >
            <Text style={{ fontSize: 16, color: "#4b5563" }}>
              No encontramos guías para este país.
            </Text>
          </View>
        ) : null}

        {!loading &&
          guides.map((guide) => (
            <Pressable
              key={guide._id}
              onPress={() =>
                router.push({
                  pathname: "/guia-detalle",
                  params: { id: guide._id }
                })
              }
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 16,
                padding: 16,
                backgroundColor: "#ffffff"
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                {guide.name || "Guía"}
              </Text>

              <Text style={{ marginTop: 4, color: "#6b7280" }}>
                {[guide.city, guide.country].filter(Boolean).join(", ")}
              </Text>

              <Text style={{ marginTop: 8, color: "#374151" }}>
                {guide.bio || "Guía personal disponible para viajeros."}
              </Text>

              {Array.isArray(guide.languages) && guide.languages.length > 0 ? (
                <Text style={{ marginTop: 8, color: "#0f766e" }}>
                  Idiomas: {guide.languages.join(", ")}
                </Text>
              ) : null}
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}