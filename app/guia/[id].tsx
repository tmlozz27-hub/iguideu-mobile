import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function GuiaLegacyRedirectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!id) {
      router.replace("/");
      return;
    }

    router.replace({
      pathname: "/guia-detalle",
      params: { id }
    });
  }, [id, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}