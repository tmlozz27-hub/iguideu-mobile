import React from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

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

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      }}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 28,
          paddingBottom: 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", marginTop: 8 }}>
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
            Tu experiencia comienza aquí
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
            Descubrí tu próximo guía
          </Text>

          <Text
            style={{
              color: "rgba(23,59,107,0.82)",
              fontSize: 16,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            Elegí cómo querés explorar: por país, por cercanía o desde tus reservas.
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
            title="Explorar guías"
            subtitle="Todos los perfiles"
            emoji="🌍"
            onPress={() => router.push("/guias")}
          />

          <Card
            title="Guías cercanos"
            subtitle="Cerca de vos"
            emoji="📍"
            onPress={() => router.push("/guias-cercanos")}
          />

          <Card
            title="Guías por país"
            subtitle="Buscá tu destino"
            emoji="🧭"
            onPress={() => router.push("/buscar-pais")}
          />

          <Card
            title="Mis reservas"
            subtitle="Tu actividad"
            emoji="🗓️"
            onPress={() => router.push("/reservas")}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          <Card
            title="Mi perfil"
            subtitle="Gestioná tu cuenta y tu información"
            emoji="👤"
            wide
            onPress={() => router.push("/perfil")}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
