import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function GeoScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/guias-cercanos");
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ alignItems: "center", gap: 10 }}>
        <ActivityIndicator size="large" />
        <Text>Redirigiendo...</Text>
      </View>
    </SafeAreaView>
  );
}