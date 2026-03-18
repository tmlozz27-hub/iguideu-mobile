import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { apiGet } from "../config/api";

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
  distanceKm?: number;
  geo?: {
    lat?: number;
    lng?: number;
  };
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
};

type NearbyResponse = {
  ok?: boolean;
  center?: {
    lat?: number;
    lng?: number;
  };
  radiusKm?: number;
  count?: number;
  items?: Guide[];
};

const FALLBACK_LAT = -34.6037;
const FALLBACK_LNG = -58.3816;
const SEARCH_RADIUS_KM = 50;

function getGuideLat(guide: Guide): number | null {
  const value =
    guide.lat ??
    guide.latitude ??
    guide.geo?.lat ??
    null;

  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function getGuideLng(guide: Guide): number | null {
  const value =
    guide.lng ??
    guide.longitude ??
    guide.geo?.lng ??
    null;

  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function getGuideKey(guide: Guide, index: number): string {
  return String(guide._id || guide.gid || guide.id || `guide-${index}`);
}

function formatDistance(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Sin distancia";
  }
  if (value < 1) {
    return `${value.toFixed(2)} km`;
  }
  return `${value.toFixed(1)} km`;
}

function formatPrice(guide: Guide): string {
  const price = guide.priceHour ?? 0;
  if (!price) {
    return "Tarifa no disponible";
  }
  return `USD ${price}/hora`;
}

export default function GuiasCercanosScreen() {
  const router = useRouter();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Buscando ubicación...");
  const [center, setCenter] = useState({ lat: FALLBACK_LAT, lng: FALLBACK_LNG });
  const [selectedGuideKey, setSelectedGuideKey] = useState<string | null>(null);

  const selectedGuide = useMemo(() => {
    if (!selectedGuideKey) return null;
    return guides.find((guide, index) => getGuideKey(guide, index) === selectedGuideKey) || null;
  }, [guides, selectedGuideKey]);

  const mapRegion: Region = useMemo(() => {
    return {
      latitude: center.lat,
      longitude: center.lng,
      latitudeDelta: 0.18,
      longitudeDelta: 0.18
    };
  }, [center.lat, center.lng]);

  async function loadGuides() {
    try {
      let lat = FALLBACK_LAT;
      let lng = FALLBACK_LNG;

      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status === "granted") {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });

          lat = current.coords.latitude;
          lng = current.coords.longitude;
          setLocationLabel(`Tu zona actual: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } else {
          setLocationLabel("Sin permiso de ubicación. Usando Buenos Aires de prueba.");
        }
      } catch (error) {
        console.log("LOCATION ERROR", error);
        setLocationLabel("Ubicación no disponible. Usando Buenos Aires de prueba.");
      }

      setCenter({ lat, lng });

      const data = (await apiGet(
        `/api/guides/nearby?lat=${lat}&lng=${lng}&radius=${SEARCH_RADIUS_KM}`
      )) as NearbyResponse;

      const arr = Array.isArray(data?.items) ? data.items : [];
      setGuides(arr);

      if (arr.length > 0) {
        setSelectedGuideKey(getGuideKey(arr[0], 0));
      } else {
        setSelectedGuideKey(null);
      }
    } catch (error) {
      console.log("ERROR loadGuides()", error);
      setGuides([]);
      setSelectedGuideKey(null);
      Alert.alert("Error", "No se pudieron cargar los guías cercanos.");
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

  function openGuide(guide: Guide, index: number) {
    const routeId = String(guide.id || guide._id || guide.gid || "");
    if (!routeId) {
      Alert.alert("Error", "Este guía no tiene identificador válido.");
      return;
    }

    router.push({
      pathname: "/guia-detalle",
      params: {
        id: routeId
      }
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Cargando guías cercanos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 6 }}>
          Guías cercanos
        </Text>
        <Text style={{ opacity: 0.75, marginBottom: 4 }}>
          {locationLabel}
        </Text>
        <Text style={{ opacity: 0.75 }}>
          Radio de búsqueda: {SEARCH_RADIUS_KM} km
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={mapRegion}
          region={mapRegion}
          showsUserLocation
          showsMyLocationButton
        >
          <Marker
            coordinate={{
              latitude: center.lat,
              longitude: center.lng
            }}
            title="Tu ubicación"
            pinColor="azure"
          />

          {guides.map((guide, index) => {
            const lat = getGuideLat(guide);
            const lng = getGuideLng(guide);

            if (lat === null || lng === null) {
              return null;
            }

            return (
              <Marker
                key={getGuideKey(guide, index)}
                coordinate={{
                  latitude: lat,
                  longitude: lng
                }}
                title={guide.name || "Guía"}
                description={[guide.city || "-", guide.country || "-"].join(", ")}
                onPress={() => setSelectedGuideKey(getGuideKey(guide, index))}
              />
            );
          })}
        </MapView>
      </View>

      <ScrollView
        style={{ maxHeight: 280, backgroundColor: "#ffffff" }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {guides.length === 0 ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#ffffff"
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
              No hay guías disponibles
            </Text>
            <Text style={{ opacity: 0.75 }}>
              Probá actualizar o revisar permisos de ubicación.
            </Text>
          </View>
        ) : (
          <>
            {selectedGuide ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#111827",
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: "#ffffff"
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "800" }}>
                  {selectedGuide.name || "Guía"}
                </Text>
                <Text style={{ marginTop: 6, opacity: 0.8 }}>
                  {[selectedGuide.city || "-", selectedGuide.country || "-"].join(", ")}
                </Text>
                <Text style={{ marginTop: 6 }}>
                  ⭐ {selectedGuide.rating ?? "-"} • {formatDistance(selectedGuide.distanceKm)}
                </Text>
                <Text style={{ marginTop: 6 }}>
                  {formatPrice(selectedGuide)}
                </Text>
                {!!selectedGuide.bio && (
                  <Text style={{ marginTop: 8, opacity: 0.85 }}>
                    {selectedGuide.bio}
                  </Text>
                )}

                <Pressable
                  onPress={() => {
                    const index = guides.findIndex((guide, idx) => getGuideKey(guide, idx) === selectedGuideKey);
                    openGuide(selectedGuide, index >= 0 ? index : 0);
                  }}
                  style={{
                    marginTop: 12,
                    backgroundColor: "#111827",
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ color: "#ffffff", fontWeight: "800", fontSize: 16 }}>
                    Ver perfil del guía
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {guides.map((guide, index) => {
              const key = getGuideKey(guide, index);
              const isSelected = key === selectedGuideKey;

              return (
                <Pressable
                  key={key}
                  onPress={() => setSelectedGuideKey(key)}
                  style={{
                    borderWidth: 1,
                    borderColor: isSelected ? "#111827" : "#e5e7eb",
                    borderRadius: 14,
                    padding: 14,
                    backgroundColor: "#ffffff"
                  }}
                >
                  <Text style={{ fontWeight: "800", fontSize: 16 }}>
                    {guide.name || "Guía"}
                  </Text>
                  <Text style={{ marginTop: 4, opacity: 0.8 }}>
                    {[guide.city || "-", guide.country || "-"].join(", ")}
                  </Text>
                  <Text style={{ marginTop: 6 }}>
                    ⭐ {guide.rating ?? "-"} • {formatDistance(guide.distanceKm)}
                  </Text>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}