import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getGuides } from "../../config/api";

type Guide = {
  _id?: string; // Mongo
  id?: string; // demo
  name: string;
  city?: string;
  country?: string;
  rating?: number;
  languages?: string[];
};

function normalizeGuides(payload: any): Guide[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.guides)) return payload.guides;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

// Ocultar seeds "Guía 1/2/3" (por ID y por patrón de nombre)
const HIDE_GUIDE_IDS = new Set<string>([
  "6962a50dd8b348ef12de5547", // Guía 1
  "6962a50dd8b348ef12de5548", // Guía 2
  "6962a50ed8b348ef12de5549", // Guía 3
]);

function shouldHideGuide(g: Guide): boolean {
  const gid = String(g._id || g.id || "");
  if (gid && HIDE_GUIDE_IDS.has(gid)) return true;

  const name = (g.name || "").trim();
  // "Guía 1", "Guía 2", "Guía 3", etc.
  if (/^Guía\s+\d+$/i.test(name)) return true;

  return false;
}

export default function GuiasScreen() {
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const payload = await getGuides();
      const list = normalizeGuides(payload);
      setGuides(list);
    } catch (e: any) {
      console.log("[GUIDES ERROR]", e?.message || e);
      setGuides([]);
      setError(e?.message || "Network request failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleGuides = useMemo(() => {
    return guides.filter((g) => !shouldHideGuide(g));
  }, [guides]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando guías…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error === "Network request failed" ? "Network request failed" : error}
        </Text>
        <TouchableOpacity style={styles.retry} onPress={load}>
          <Text>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleGuides}
        keyExtractor={(item, idx) => String(item._id || item.id || idx)}
        ListEmptyComponent={<Text>No hay guías disponibles</Text>}
        renderItem={({ item }) => {
          const gid = item._id || item.id;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                if (gid) router.push(`/guia/${gid}`);
              }}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.city}>
                {item.city || "Ciudad"}
                {item.country ? ` · ${item.country}` : ""}
              </Text>
              <Text style={styles.meta}>
                ⭐ {item.rating?.toFixed(1) ?? "—"}{" "}
                {item.languages?.length
                  ? `· Idiomas: ${item.languages.join(", ")}`
                  : ""}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  error: { color: "red" },
  retry: { marginTop: 10, padding: 10, backgroundColor: "#eee", borderRadius: 8 },
  card: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: "#f3f3f3",
  },
  name: { fontSize: 18, fontWeight: "800" },
  city: { marginTop: 4, color: "#555" },
  meta: { marginTop: 6, color: "#333", fontSize: 13 },
});

