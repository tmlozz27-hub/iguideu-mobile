import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

export default function GeoScreen() {
  const [coords, setCoords] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setCoords(loc.coords);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text>Obteniendo ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Latitude: {coords?.latitude}</Text>
      <Text>Longitude: {coords?.longitude}</Text>
    </View>
  );
}