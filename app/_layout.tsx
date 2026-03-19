import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="guia-detalle" />
      <Stack.Screen name="select-role" />
      <Stack.Screen name="legal/terms" />
      <Stack.Screen name="legal/privacy" />
    </Stack>
  );
}