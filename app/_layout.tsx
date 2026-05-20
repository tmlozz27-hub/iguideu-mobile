import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const publishableKey =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ||
    "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  console.log(
    "STRIPE_PK_PREFIX_RUNTIME",
    publishableKey ? publishableKey.slice(0, 12) : "VACIA"
  );

  return (
    <StripeProvider publishableKey={publishableKey}>
      {showSplash ? (
        <ImageBackground
          source={require("../assets/splash.png")}
          style={styles.splash}
          resizeMode="cover"
        />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});