import React from "react";
import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Text, View } from "react-native";

export default function RootLayout() {
  const publishableKey =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ||
    "";

  console.log(
    "STRIPE_PK_PREFIX_RUNTIME",
    publishableKey ? publishableKey.slice(0, 12) : "VACIA"
  );

  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "red" }}>
          ERROR: Stripe Publishable Key no configurada
        </Text>
      </View>
    );
  }

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