import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet } from "@/config/api";
import { useFocusEffect, useRouter } from "expo-router";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    loading: "Cargando guías cercanos",
    title: "Guías cercanos",
    subtitle: "Explorá guías ubicados cerca de tu zona y abrí su perfil para reservar.",
    yourLocation: "Tu ubicación",
    guide: "Guía",
    emptyTitle: "No hay guías disponibles",
    emptySubtitle: "Probá nuevamente en unos minutos.",
    back: "Volver"
  },
  en: {
    loading: "Loading nearby guides",
    title: "Nearby guides",
    subtitle: "Explore guides near your area and open their profile to book.",
    yourLocation: "Your location",
    guide: "Guide",
    emptyTitle: "No guides available",
    emptySubtitle: "Try again in a few minutes.",
    back: "Back"
  },
};

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
  const [lang, setLang] = useState<"es" | "en">("es");
  const t = copy[lang];

  const loadLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);
    if (savedLang === "es" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    loadLang();
    load();
  }, [loadLang]);

  useFocusEffect(
    useCallback(() => {
      loadLang();
    }, [loadLang])
  );

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2
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
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          }}
          style={{ flex: 1, backgroundColor: "#76A9E8" }}
          resizeMode="cover"
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#15539A" />
            <Text style={{ marginTop: 12, color: "#15539A", fontWeight: "800", fontSize: 18 }}>
              {t.loading}
            </Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={Platform.OS === "ios" ? ["top", "left", "right"] : []}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
        }}
        style={{ flex: 1, backgroundColor: "#76A9E8" }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 8 }}>
          {Platform.OS === "ios" && (
            <View style={{ alignItems: "flex-start", marginBottom: 12 }}>
              <Pressable
                onPress={() => router.back()}
                style={{
                  backgroundColor: "rgba(255,255,255,0.14)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.20)",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 999
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>{t.back}</Text>
              </Pressable>
            </View>
          )}

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.42)",
              borderRadius: 24,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)"
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#15539A", textAlign: "center" }}>
              {t.title}
            </Text>

            <Text style={{ marginTop: 8, textAlign: "center", color: "#173B6B", fontSize: 15 }}>
              {t.subtitle}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              borderRadius: 24,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)",
              backgroundColor: "rgba(255,255,255,0.18)"
            }}
          >
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: center.lat,
                longitude: center.lng,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2
              }}
            >
              <Marker
                coordinate={{ latitude: center.lat, longitude: center.lng }}
                title={t.yourLocation}
                pinColor="#15539A"
              />

              {guides.map((g, i) => {
                const lat = g.lat ?? g.latitude;
                const lng = g.lng ?? g.longitude;

                if (lat == null || lng == null) return null;

                return (
                  <Marker
                    key={g._id || g.id || String(i)}
                    coordinate={{ latitude: lat, longitude: lng }}
                    title={g.name || t.guide}
                    description={[g.city, g.country].filter(Boolean).join(", ")}
                    pinColor="#1CC9B7"
                  />
                );
              })}
            </MapView>
          </View>

          <View
            style={{
              marginTop: 12,
              maxHeight: 270,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.34)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)"
            }}
          >
            <ScrollView>
              {guides.length === 0 ? (
                <View style={{ padding: 18 }}>
                  <Text style={{ fontWeight: "800", color: "#15539A" }}>{t.emptyTitle}</Text>
                  <Text style={{ color: "#173B6B" }}>{t.emptySubtitle}</Text>
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
                          params: { guideId: id, guideData: JSON.stringify(g) }
                        })
                      }
                      style={{
                        padding: 14,
                        borderBottomWidth: 1,
                        borderColor: "rgba(21,83,154,0.12)"
                      }}
                    >
                      <Text style={{ fontWeight: "800", color: "#15539A" }}>{g.name}</Text>
                      <Text style={{ color: "#173B6B" }}>
                        {[g.city, g.country].filter(Boolean).join(", ")}
                      </Text>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}