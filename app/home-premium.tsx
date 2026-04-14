import React from "react";
import { View, Pressable, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomePremium() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/home-premium-final.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.frame}>
        <Pressable
          style={[styles.hit, styles.explorar]}
          onPress={() => router.push("/guias")}
        />
        <Pressable
          style={[styles.hit, styles.cercanos]}
          onPress={() => router.push("/guias-cercanos")}
        />
        <Pressable
          style={[styles.hit, styles.pais]}
          onPress={() => router.push("/buscar-pais")}
        />
        <Pressable
          style={[styles.hit, styles.reservas]}
          onPress={() => router.push("/(tabs)/reservas")}
        />
        <Pressable
          style={[styles.hit, styles.perfil]}
          onPress={() => router.push("/(tabs)/perfil")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  frame: {
    position: "absolute",
    top: "29%",
    left: "7%",
    width: "86%",
    height: "54%",
  },

  hit: {
    position: "absolute",
    backgroundColor: "rgba(255,0,0,0.0)",
  },

  explorar: {
    top: "22%",
    left: "1%",
    width: "48%",
    height: "22%",
  },

  cercanos: {
    top: "22%",
    right: "1%",
    width: "48%",
    height: "22%",
  },

  pais: {
    top: "46.5%",
    left: "1%",
    width: "48%",
    height: "17%",
  },

  reservas: {
    top: "46.5%",
    right: "1%",
    width: "48%",
    height: "17%",
  },

  perfil: {
    top: "66%",
    left: "2%",
    width: "96%",
    height: "16%",
  },
});