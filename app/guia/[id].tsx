import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { apiGet } from "../../config/api";

type Guide = {
  _id?: string;
  gid?: string;
  id?: string;
  guideId?: string;
  name?: string;
  guideName?: string;
  bio?: string;
  city?: string;
  country?: string;
  rating?: number;
  priceHour?: number;
  priceDay?: number;
  price24h?: number;
  avatarUrl?: string;
  active?: boolean;
  distanceKm?: number;
  languages?: string[];
};

function guideMatchesId(guide: Guide, id: string) {
  return (
    String(guide._id || "") === id ||
    String(guide.id || "") === id ||
    String(guide.gid || "") === id ||
    String(guide.guideId || "") === id
  );
}

export default function GuideDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    guideName?: string;
    city?: string;
    country?: string;
  }>();

  const routeId = String(params.id || "");
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await apiGet<any>("/api/guides");
        const list: Guide[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.guides)
            ? res.guides
            : Array.isArray(res?.items)
              ? res.items
              : [];

        const found =
          list.find((item) => guideMatchesId(item, routeId)) ||
          list.find((item) => (item.name || item.guideName || "") === String(params.guideName || ""));

        setGuide(found || null);
      } catch (error) {
        console.log("ERROR loadGuide()", error);
        setGuide(null);
      } finally {
        setLoading(false);
      }
    }

    loadGuide();
  }, [routeId, params.guideName]);

  const title = useMemo(() => {
    return guide?.name || guide?.guideName || String(params.guideName || "Guía");
  }, [guide, params.guideName]);

  function goToReserva() {
    const guideId = encodeURIComponent(
      String(guide?._id || guide?.id || guide?.gid || guide?.guideId || routeId)
    );
    const guideName = encodeURIComponent(String(guide?.name || guide?.guideName || title));
    const city = encodeURIComponent(String(guide?.city || params.city || ""));
    const country = encodeURIComponent(String(guide?.country || params.country || ""));

    router.replace(`/(tabs)/reservas?guideId=${guideId}&guideName=${guideName}&city=${city}&country=${country}`);
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando guía...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", marginBottom: 10 }}>{title}</Text>

        <View style={{ borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Ubicación</Text>
          <Text style={{ fontSize: 16 }}>
            {guide?.city || params.city || "-"}, {guide?.country || params.country || "-"}
          </Text>
        </View>

        <View style={{ borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Calificación</Text>
          <Text style={{ fontSize: 16 }}>⭐ {guide?.rating ?? "-"}</Text>
        </View>

        <View style={{ borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Descripción</Text>
          <Text style={{ fontSize: 16, lineHeight: 24 }}>
            {guide?.bio || "Guía local disponible para experiencias personalizadas."}
          </Text>
        </View>

        <View style={{ borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 18 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>Tarifas</Text>
          <Text style={{ marginBottom: 6 }}>Hora: USD {guide?.priceHour ?? 25}</Text>
          <Text style={{ marginBottom: 6 }}>Día: USD {guide?.priceDay ?? 160}</Text>
          <Text>24h: USD {guide?.price24h ?? 420}</Text>
        </View>

        <Pressable
          onPress={goToReserva}
          style={{
            backgroundColor: "#000",
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            marginBottom: 12
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>RESERVAR ESTE GUÍA</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={{
            borderWidth: 1,
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700" }}>VOLVER A GUÍAS</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}