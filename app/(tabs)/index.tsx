import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

const copy = {
  es: {
    tagline: "Tu experiencia comienza aquí",
    discover: "Descubrí tu próximo guía",

    exploreTitle: "Explorar guías",
    exploreSub: "Todos los perfiles",

    nearbyTitle: "Guías cercanos",
    nearbySub: "Cerca de vos",

    countryTitle: "Guías por país",
    countrySub: "Buscá tu destino",

    bookingsTitle: "Mis reservas",
    bookingsSub: "Tu actividad",

    profileTitle: "Mi perfil",
    profileSub: "Gestioná tu cuenta y tu información",
  },

  en: {
    tagline: "Your experience starts here",
    discover: "Discover your next guide",

    exploreTitle: "Explore guides",
    exploreSub: "All profiles",

    nearbyTitle: "Nearby guides",
    nearbySub: "Close to you",

    countryTitle: "Guides by country",
    countrySub: "Find your destination",

    bookingsTitle: "My bookings",
    bookingsSub: "Your activity",

    profileTitle: "My profile",
    profileSub: "Manage your account and information",
  },
};

function Card({
  title,
  subtitle,
  emoji,
  onPress,
  wide = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: wide ? "100%" : "48.5%",
        minHeight: wide ? 100 : 118,
        borderRadius: 24,
        backgroundColor: "rgba(255,255,255,0.22)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
        paddingHorizontal: 16,
        paddingVertical: 16,
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 24 }}>{emoji}</Text>

      <View>
        <Text
          style={{
            color: "#173B6B",
            fontSize: wide ? 22 : 18,
            fontWeight: "800",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "rgba(23,59,107,0.78)",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeTabScreen() {
  const router = useRouter();

  const [lang, setLang] = useState<"es" | "en">("es");

  const t = copy[lang];

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      }}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(183,209,245,0.52)",
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 28,
          paddingBottom: 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: "flex-end",
            marginBottom: 10,
          }}
        >
          <Pressable
            onPress={() => setLang(lang === "es" ? "en" : "es")}
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 18,
            }}
          >
            <Text
              style={{
                color: "#173B6B",
                fontWeight: "900",
                fontSize: 14,
              }}
            >
              {lang === "es" ? "ES" : "EN"}
            </Text>
          </Pressable>
        </View>

        <View style={{ alignItems: "center", marginTop: 2 }}>
          <Text
            style={{
              color: "#173B6B",
              fontSize: 42,
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            I GUIDE U
          </Text>

          <Text
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 16,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {t.tagline}
          </Text>
        </View>

        <View
          style={{
            marginTop: 26,
            borderRadius: 28,
            backgroundColor: "rgba(255,255,255,0.38)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.48)",
            paddingHorizontal: 18,
            paddingVertical: 22,
          }}
        >
          <Text
            style={{
              color: "#173B6B",
              fontSize: 28,
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            {t.discover}
          </Text>
        </View>

        <View
          style={{
            marginTop: 18,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: 14,
          }}
        >
          <Card
            title={t.exploreTitle}
            subtitle={t.exploreSub}
            emoji="🌍"
            onPress={() => router.push("/guias")}
          />

          <Card
            title={t.nearbyTitle}
            subtitle={t.nearbySub}
            emoji="📍"
            onPress={() => router.push("/guias-cercanos")}
          />

          <Card
            title={t.countryTitle}
            subtitle={t.countrySub}
            emoji="🧭"
            onPress={() => router.push("/buscar-pais")}
          />

          <Card
            title={t.bookingsTitle}
            subtitle={t.bookingsSub}
            emoji="🗓️"
            onPress={() => router.push("/reservas")}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          <Card
            title={t.profileTitle}
            subtitle={t.profileSub}
            emoji="👤"
            wide
            onPress={() => router.push("/perfil")}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}