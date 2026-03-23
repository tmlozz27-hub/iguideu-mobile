import React from "react";
import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";

export default function RootLayout() {
  const publishableKey =
    (Constants.expoConfig?.extra as any)?.stripePublishableKey || "";

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="guia-detalle" />
        <Stack.Screen name="select-role" />
        <Stack.Screen name="legal/terms" />
        <Stack.Screen name="legal/privacy" />
      </Stack>
    </StripeProvider>
  );
}