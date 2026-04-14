import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { apiGet } from "@/config/api";

type Guide = {
  _id?: string;
  id?: string;
  name?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
};

export default function GuiasCercanosScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({ lat: -34.6037, lng: -58.3816 });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      },
      600
    );
  }, [center.lat, center.lng]);

  async function load() {
    try {
      setLoading(true);

      let lat = -34.6037;
      let lng = -58.3816;

      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          lat = loc.coords.latitude;
          lng = loc.coords.longitude;
        }
      } catch {}

      setCenter({ lat, lng });

      const data = await apiGet(`/api/guides/nearby?lat=${lat}&lng=${lng}&radius=50`);
      let arr = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];

      if (arr.length === 0) {
        const fallback = await apiGet("/api/guides");
        arr = Array.isArray(fallback?.items)
          ? fallback.items
          : Array.isArray(fallback)
          ? fallback
          : [];
      }

      setGuides(arr);
    } catch (error) {
      console.log("ERROR_GUIAS_CERCANOS", error);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: center.lat,
            longitude: center.lng,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          <Marker
            coordinate={{ latitude: center.lat, longitude: center.lng }}
            title="Tu ubicación"
          />

          {guides.map((g, i) => {
            const lat = g.lat ?? g.latitude;
            const lng = g.lng ?? g.longitude;

            if (lat == null || lng == null) return null;

            return (
              <Marker
                key={g._id || g.id || String(i)}
                coordinate={{ latitude: lat, longitude: lng }}
                title={g.name || "Guía"}
                description={[g.city, g.country].filter(Boolean).join(", ")}
              />
            );
          })}
        </MapView>

        <ScrollView style={{ maxHeight: 260, backgroundColor: "#fff" }}>
          {guides.length === 0 ? (
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: "700", marginBottom: 4 }}>No hay guías disponibles</Text>
              <Text>Probá nuevamente en unos minutos o revisá otra zona.</Text>
            </View>
          ) : (
            guides.map((g, i) => {
              const id = g._id || g.id || String(i);

              return (
                <Pressable
                  key={id}
                  onPress={() =>
                    router.push({
                      pathname: "/guia-detalle",
                      params: {
                        guideId: id,
                        guideData: JSON.stringify(g),
                      },
                    })
                  }
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: "#ddd",
                  }}
                >
                  <Text style={{ fontWeight: "700" }}>{g.name || "Guía"}</Text>
                  <Text>{[g.city, g.country].filter(Boolean).join(", ") || "-"}</Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}