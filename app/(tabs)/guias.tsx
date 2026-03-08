import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
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
  distanceKm?: number;
  geo?: {
    lat?: number;
    lng?: number;
  };
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

const TEST_LAT = -34.6037;
const TEST_LNG = -58.3816;
const TEST_RADIUS_KM = 20000;

export default function GuiasScreen() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Usando ubicación de prueba Buenos Aires");

  async function loadGuides() {
    try {
      let lat: number | null = null;
      let lng: number | null = null;

      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status === "granted") {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          lat = current.coords.latitude;
          lng = current.coords.longitude;
          setLocationLabel(`Cerca de ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } else {
          lat = TEST_LAT;
          lng = TEST_LNG;
          setLocationLabel("Sin permiso. Usando Buenos Aires de prueba");
        }
      } catch (locationError) {
        console.log("LOCATION ERROR", locationError);
        lat = TEST_LAT;
        lng = TEST_LNG;
        setLocationLabel("Ubicación no disponible. Usando Buenos Aires de prueba");
      }

      const data = await apiGet<NearbyResponse>(
        `/api/guides/nearby?lat=${lat}&lng=${lng}&radius=${TEST_RADIUS_KM}`
      );

      const arr = Array.isArray(data?.items) ? data.items : [];
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

  function formatDistance(value?: number) {
    if (typeof value !== "number" || Number.isNaN(value)) return null;
    if (value < 1) return `${value.toFixed(2)} km`;
    return `${value.toFixed(1)} km`;
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
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 6 }}>Guías</Text>
      <Text style={{ marginBottom: 12, opacity: 0.7 }}>{locationLabel}</Text>

      <FlatList
        data={guides}
        keyExtractor={(item, index) => String(item._id || item.gid || item.id || `guide-${index}`)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ opacity: 0.7 }}>No hay guías disponibles</Text>}
        renderItem={({ item }) => {
          const distanceText = formatDistance(item.distanceKm);

          return (
            <View style={{ borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <Text style={{ fontWeight: "800", fontSize: 16 }}>{item.name || "Guía"}</Text>

              <Text style={{ marginTop: 4, opacity: 0.8 }}>
                {item.city || "-"}, {item.country || "-"}
              </Text>

              {!!item.bio && <Text style={{ marginTop: 6 }}>{item.bio}</Text>}

              <Text style={{ marginTop: 6, fontWeight: "700" }}>
                ⭐ {item.rating ?? "-"}
                {distanceText ? ` • ${distanceText}` : ""}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}