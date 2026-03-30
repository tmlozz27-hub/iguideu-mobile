import React from "react";
import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";

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
    console.warn("Stripe Publishable Key no configurada");
  }

  return (
    <StripeProvider publishableKey={publishableKey || "pk_test_placeholder"}>
      <Stack screenOptions={{ headerShown: false }} />
    </StripeProvider>
  );
}