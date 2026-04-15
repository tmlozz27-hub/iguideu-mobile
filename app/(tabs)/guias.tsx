import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { apiGet } from "@/config/api";

type Guide = {
  _id?: string;
  id?: string;
  name?: string;
  country?: string;
  city?: string;
  languages?: string[];
  rating?: number;
  priceDay?: number;
  price24h?: number;
  bio?: string;
};

function money(value?: number) {
  if (!value || value <= 0) return "-";
  return `USD ${value}`;
}

export default function GuiasScreen() {
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGuides = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await apiGet("/api/guides")) as any;

      const list =
        Array.isArray(data) ? data :
        Array.isArray(data?.items) ? data.items :
        Array.isArray(data?.guides) ? data.guides :
        Array.isArray(data?.data) ? data.data :
        [];

      setGuides(list);
    } catch {
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
      }}
      style={{ flex: 1, backgroundColor: "#76A9E8" }}
      resizeMode="cover"
    >
      <View style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(90,136,204,0.35)" }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.45)",
            borderRadius: 28,
            padding: 20
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#15539A" }}>
            Guías
          </Text>

          <Text style={{ marginTop: 8, fontSize: 15, color: "#173B6B", lineHeight: 22 }}>
            Abrí perfiles reales, revisá tarifas y seguí directo a reserva.
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Pressable
              onPress={() => router.push("/guias-cercanos")}
              style={{
                flex: 1,
                backgroundColor: "#1CC9B7",
                paddingVertical: 15,
                borderRadius: 18,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "800" }}>
                Guías cercanos
              </Text>
            </Pressable>

            <Pressable
              onPress={loadGuides}
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                paddingVertical: 15,
                borderRadius: 18,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#15539A", fontWeight: "800" }}>
                Recargar
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/guides-by-country")}
            style={{
              marginTop: 10,
              backgroundColor: "rgba(255,255,255,0.35)",
              paddingVertical: 15,
              borderRadius: 18,
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#15539A", fontWeight: "800" }}>
              Buscar por país
            </Text>
          </Pressable>
        </View>

        {/* LOADING */}
        {loading && (
          <View style={{ paddingTop: 32 }}>
            <ActivityIndicator size="large" color="#15539A" />
          </View>
        )}

        {/* EMPTY */}
        {!loading && guides.length === 0 && (
          <View
            style={{
              marginTop: 16,
              borderRadius: 22,
              padding: 18,
              backgroundColor: "rgba(255,255,255,0.35)"
            }}
          >
            <Text style={{ color: "#173B6B" }}>
              No hay guías para mostrar.
            </Text>
          </View>
        )}

        {/* CARDS */}
        {guides.map((guide, index) => {
          const guideId = guide._id || guide.id || String(index);
          const location = [guide.city, guide.country].filter(Boolean).join(", ");
          const languages = Array.isArray(guide.languages) && guide.languages.length > 0
            ? guide.languages.join(", ")
            : "A confirmar";

          return (
            <Pressable
              key={guideId}
              onPress={() => router.push({ pathname: "/guia-detalle", params: { guideId } })}
              style={{
                marginTop: 16,
                borderRadius: 24,
                padding: 18,
                backgroundColor: "rgba(255,255,255,0.38)"
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "800", color: "#15539A" }}>
                {guide.name || "Guía"}
              </Text>

              <Text style={{ marginTop: 8, color: "#173B6B" }}>
                {location || "Ubicación a confirmar"}
              </Text>

              <Text style={{ marginTop: 4, color: "#173B6B" }}>
                Idiomas: {languages}
              </Text>

              <Text style={{ marginTop: 4, color: "#173B6B" }}>
                Rating: {guide.rating ?? "-"}
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 16, padding: 12 }}>
                  <Text style={{ color: "#173B6B", fontSize: 13 }}>
                    Jornada 8h
                  </Text>
                  <Text style={{ color: "#15539A", fontWeight: "800", fontSize: 16 }}>
                    {money(guide.priceDay)}
                  </Text>
                </View>

                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 16, padding: 12 }}>
                  <Text style={{ color: "#173B6B", fontSize: 13 }}>
                    24 horas
                  </Text>
                  <Text style={{ color: "#15539A", fontWeight: "800", fontSize: 16 }}>
                    {money(guide.price24h)}
                  </Text>
                </View>
              </View>

              <Text style={{ marginTop: 14, color: "#173B6B", lineHeight: 22 }}>
                {guide.bio || "Guía local disponible para experiencias personalizadas."}
              </Text>

              <View
                style={{
                  marginTop: 14,
                  backgroundColor: "#1CC9B7",
                  paddingVertical: 13,
                  borderRadius: 16,
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#ffffff", fontWeight: "800" }}>
                  Ver perfil
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}