import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiGet } from "../../config/api";

type Guide = {
  _id?: string;
  gid?: string;
  id?: string;
  name?: string;
  bio?: string;
  city?: string;
  country?: string;
  rating?: number;
  priceHour?: number;
  priceDay?: number;
  price24h?: number;
  avatarUrl?: string;
  active?: boolean;
};

export default function GuiasScreen() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadGuides() {
    try {
      const data = await apiGet<Guide[]>("/api/guides");
      const arr = Array.isArray(data) ? data : [];
      setGuides(arr);
    } catch (e) {
      console.log("ERROR loadGuides()", e);
      setGuides([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadGuides();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    loadGuides();
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando guías...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 12 }}>Guías</Text>

      <FlatList
        data={guides}
        keyExtractor={(item) => String(item._id || item.gid || item.id || Math.random())}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ opacity: 0.7 }}>No hay guías disponibles</Text>}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <Text style={{ fontWeight: "800", fontSize: 16 }}>{item.name || "Guía"}</Text>
            <Text style={{ marginTop: 4, opacity: 0.8 }}>
              {item.city || "-"}, {item.country || "-"}
            </Text>
            <Text style={{ marginTop: 6 }}>{item.bio || ""}</Text>
            <Text style={{ marginTop: 6, fontWeight: "700" }}>⭐ {item.rating ?? "-"}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}