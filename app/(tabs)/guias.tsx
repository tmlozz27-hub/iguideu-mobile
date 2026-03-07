import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiGet } from "../../config/api";
import useLocation from "../../hooks/useLocation";
import { getDistance } from "../../lib/distance";

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
  lat?: number;
  lng?: number;
  distance?: number;
};

export default function GuiasScreen() {
  const userLocation = useLocation();

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

  const sortedGuides = useMemo(() => {
    if (!userLocation) return guides;

    return [...guides]
      .map((guide) => {
        if (
          typeof guide.lat === "number" &&
          typeof guide.lng === "number"
        ) {
          const distance = getDistance(
            userLocation.latitude,
            userLocation.longitude,
            guide.lat,
            guide.lng
          );
          return { ...guide, distance };
        }
        return { ...guide, distance: undefined };
      })
      .sort((a, b) => {
        const da = a.distance ?? Number.MAX_SAFE_INTEGER;
        const db = b.distance ?? Number.MAX_SAFE_INTEGER;
        return da - db;
      });
  }, [guides, userLocation]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={sortedGuides}
        keyExtractor={(item, index) =>
          item._id || item.gid || item.id || index.toString()
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {item.name || "Guide"}
            </Text>

            {item.city && (
              <Text>
                {item.city}, {item.country}
              </Text>
            )}

            {item.distance !== undefined && (
              <Text style={{ marginTop: 4 }}>
                {item.distance.toFixed(1)} km away
              </Text>
            )}

            {item.priceHour && (
              <Text style={{ marginTop: 4 }}>
                ${item.priceHour}/hour
              </Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}