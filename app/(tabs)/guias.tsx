import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { getGuides } from "../../config/api";

type Guide = {
  id?: string;
  _id?: string;
  name?: string;
  guideName?: string;
  city?: string;
  rating?: number;
  languages?: string[];
  priceHour?: number;
};

export default function GuiasScreen() {
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res: any = await getGuides();

        const arr: Guide[] =
          Array.isArray(res) ? res :
          Array.isArray(res?.guides) ? res.guides :
          Array.isArray(res?.items) ? res.items :
          Array.isArray(res?.data) ? res.data :
          [];

        if (!mounted) return;
        setGuides(arr);
      } catch (e: any) {
        console.log("ERROR getGuides()", e);
        if (!mounted) return;
        setError(e?.message || "Error loading guides");
        setGuides([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading guides…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!guides.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No guides available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={guides}
      keyExtractor={(item, i) => String(item.id || item._id || i)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name || item.guideName || "Guide"}</Text>
          <Text style={styles.city}>{item.city || "—"}</Text>
          {item.rating != null && <Text style={styles.muted}>⭐ {item.rating}</Text>}
          {item.languages?.length ? (
            <Text style={styles.muted}>Languages: {item.languages.join(", ")}</Text>
          ) : null}
          {item.priceHour != null && (
            <Text style={styles.price}>USD {item.priceHour} / hour</Text>
          )}
          <Text style={styles.muted}>gid: {String(item.id || item._id || "")}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  muted: { marginTop: 6, color: "#666" },
  error: { color: "red", fontSize: 16 },
  list: { padding: 16 },
  card: { padding: 16, marginBottom: 12, borderRadius: 8, backgroundColor: "#fff", elevation: 2 },
  name: { fontSize: 16, fontWeight: "600" },
  city: { marginTop: 4, color: "#666" },
  price: { marginTop: 6, fontWeight: "500" }
});
