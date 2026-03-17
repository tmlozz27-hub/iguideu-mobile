import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "../config/api";

type Guide = {
  _id: string;
  name: string;
  country?: string;
  city?: string;
  languages?: string[];
  rating?: number;
  pricePerHour?: number;
  priceHour?: number;
  priceDay?: number;
  price24h?: number;
  priceFullDay24h?: number;
  bio?: string;
  avatarUrl?: string;
  guideType?: string;
};

export default function GuiaDetalleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ guideId?: string }>();
  const guideId = typeof params.guideId === "string" ? params.guideId : "";

  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<Guide | null>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        const data = await apiGet("/api/guides");
        const list = Array.isArray(data) ? data : [];
        const found = list.find((g: any) => g?._id === guideId) || null;
        if (active) setGuide(found);
      } catch {
        if (active) setGuide(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [guideId]);

  const badgeText = useMemo(() => {
    if (!guide) return "";
    if (guide.guideType === "freelance") return "FREELANCE";
    return "CERTIFIED";
  }, [guide]);

  const priceHour = guide?.priceHour ?? guide?.pricePerHour ?? 0;
  const priceDay = guide?.priceDay ?? 0;
  const price24h = guide?.price24h ?? guide?.priceFullDay24h ?? 0;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#0d4d92",
        padding: 24,
        gap: 18,
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: 22,
          fontWeight: "700",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Perfil del guía
      </Text>

      {loading ? <ActivityIndicator size="large" color="#ffffff" /> : null}

      {!loading && !guide ? (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.10)",
            borderRadius: 24,
            padding: 20,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 18 }}>No se encontró el guía.</Text>
        </View>
      ) : null}

      {guide ? (
        <>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              borderRadius: 28,
              padding: 22,
              gap: 12,
            }}
          >
            <View
              style={{
                width: 108,
                height: 108,
                borderRadius: 54,
                backgroundColor: "#ffffff",
                alignSelf: "center",
                marginTop: 4,
              }}
            />

            <Text
              style={{
                color: "#ffffff",
                fontSize: 34,
                fontWeight: "800",
                textAlign: "center",
              }}
            >
              {guide.name}
            </Text>

            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#22c1a1",
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
                {badgeText}
              </Text>
            </View>

            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                textAlign: "center",
                marginTop: 2,
              }}
            >
              {[guide.city, guide.country].filter(Boolean).join(", ") || "-"}
            </Text>

            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              ★ {guide.rating ?? "-"}
            </Text>

            <Text
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontWeight: "700",
                marginTop: 8,
              }}
            >
              About me
            </Text>

            <Text
              style={{
                color: "#e5eefb",
                fontSize: 20,
                lineHeight: 30,
              }}
            >
              {guide.bio || "Guía local con experiencia acompañando viajeros y creando experiencias personalizadas."}
            </Text>

            <View style={{ marginTop: 12, gap: 10 }}>
              <Text style={{ color: "#ffffff", fontSize: 18 }}>Ubicación</Text>
              <Text style={{ color: "#dbeafe", fontSize: 18 }}>
                {[guide.city, guide.country].filter(Boolean).join(", ") || "-"}
              </Text>

              <Text style={{ color: "#ffffff", fontSize: 18, marginTop: 10 }}>Idiomas</Text>
              <Text style={{ color: "#dbeafe", fontSize: 18 }}>
                {Array.isArray(guide.languages) && guide.languages.length > 0
                  ? guide.languages.join(", ")
                  : "-"}
              </Text>

              <Text style={{ color: "#ffffff", fontSize: 18, marginTop: 10 }}>Tipo de jornada</Text>
              <Text style={{ color: "#dbeafe", fontSize: 18 }}>
                Por hora, 8 horas, 24 horas
              </Text>

              <Text style={{ color: "#ffffff", fontSize: 18, marginTop: 10 }}>Tarifas</Text>
              <Text style={{ color: "#dbeafe", fontSize: 18 }}>Por hora: USD {priceHour || "-"}</Text>
              <Text style={{ color: "#dbeafe", fontSize: 18 }}>Jornada de 8h: USD {priceDay || "-"}</Text>
              <Text style={{ color: "#dbeafe", fontSize: 18 }}>24 horas: USD {price24h || "-"}</Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/reservas",
                params: {
                  guideId: guide._id,
                  guideLocked: "1",
                },
              })
            }
            style={{
              backgroundColor: "#12b8a6",
              borderRadius: 22,
              paddingVertical: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
              Solicitar servicio
            </Text>
          </Pressable>
        </>
      ) : null}
    </ScrollView>
  );
}