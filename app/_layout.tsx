import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const iosBackHeader = {
    headerShown: Platform.OS === "ios",
    headerTitle: "",
    headerBackTitle: "Volver",
    headerTintColor: "#15539A",
    headerTransparent: true,
    headerShadowVisible: false
  };

  const publishableKey =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ||
    "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  console.log(
    "STRIPE_PK_PREFIX_RUNTIME",
    publishableKey ? publishableKey.slice(0, 12) : "VACIA"
  );

  return (
    <StripeProvider publishableKey={publishableKey}>
      {showSplash ? (
        <View style={styles.splashContainer}>
          <Image
            source={require("../assets/splash.png")}
            style={styles.splashImage}
            resizeMode="stretch"
          />
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="guias-cercanos" options={{ headerShown: false }} />
          <Stack.Screen name="guia-detalle" options={{ headerShown: false }} />
          <Stack.Screen name="crear-reserva" options={{ headerShown: false }} />
          <Stack.Screen name="chat" options={{ headerShown: false }} />
          <Stack.Screen name="perfil-guia" options={iosBackHeader} />
          <Stack.Screen name="reservas-guia" options={iosBackHeader} />
          <Stack.Screen name="buscar-pais" options={{ headerShown: false }} />
          <Stack.Screen name="guides-by-country" options={{ headerShown: false }} />
        </Stack>
      )}
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#020617"
  },
  splashImage: {
    width: "100%",
    height: "100%"
  }
});