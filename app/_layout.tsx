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

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Stack screenOptions={{ headerShown: false }} />
    </StripeProvider>
  );
}
