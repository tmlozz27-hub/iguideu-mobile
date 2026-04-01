import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "../config/api";

type Guide = {
  _id?: string;
  id?: string;
  name?: string;
  country?: string;
  city?: string;
  languages?: string[] | string;
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

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function GuiaDetalleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ guideId?: string; id?: string; guideData?: string }>();

  const guideId =
    typeof params.guideId === "string" && params.guideId.trim()
      ? params.guideId.trim()
      : typeof params.id === "string" && params.id.trim()
        ? params.id.trim()
        : "";

  const initialGuide = useMemo(() => {
    try {
      if (typeof params.guideData === "string" && params.guideData.trim()) {
        return JSON.parse(params.guideData) as Guide;
      }
    } catch {}
    return null;
  }, [params.guideData]);

  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<Guide | null>(initialGuide);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);

        const data = await apiGet("/api/guides");
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.items)
            ? (data as any).items
            : Array.isArray((data as any)?.guides)
              ? (data as any).guides
              : Array.isArray((data as any)?.value)
                ? (data as any).value
                : [];

        const found =
          list.find((g: any) => String(g?._id || "") === guideId) ||
          list.find((g: any) => String(g?.id || "") === guideId) ||
          null;

        if (!active) return;

        if (found) {
          setGuide(found);
        } else if (initialGuide) {
          setGuide(initialGuide);
        } else {
          setGuide(null);
        }
      } catch (error) {
        console.log("ERROR loading guide detail", error);
        if (!active) return;
        setGuide(initialGuide || null);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [guideId, initialGuide]);

  const badgeText = useMemo(() => {
    if (!guide) return "";
    if (guide.guideType === "freelance") return "FREELANCE";
    return "CERTIFIED";
  }, [guide]);

  const guideName = String(guide?.name || "Guía").trim();
  const guideLocation = [guide?.city, guide?.country].filter(Boolean).join(", ") || "-";
  const guideBio =
    String(guide?.bio || "").trim() ||
    "Guía local con experiencia acompañando viajeros y creando experiencias personalizadas.";
  const guideLanguages = toArray(guide?.languages);
  const guideLanguagesText = guideLanguages.length > 0 ? guideLanguages.join(", ") : "-";

  const priceHour = Number(guide?.priceHour ?? guide?.pricePerHour ?? 0);
  const price8Hours = Number(guide?.priceDay ?? 0);
  const price24h = Number(guide?.price24h ?? guide?.priceFullDay24h ?? 0);
  const selectedGuideId = String(guide?._id || guide?.id || guideId || "");

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0d4d92" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!guide) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0d4d92" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "700", textAlign: "center" }}>
            No se encontró el guía.
          </Text>
          <Text style={{ marginTop: 8, color: "#dbeafe", fontSize: 14, textAlign: "center" }}>
            guideId: {guideId || "-"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d4d92" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 34,
          gap: 18
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.10)",
            borderRadius: 28,
            padding: 22
          }}
        >
          <View
            style={{
              width: 136,
              height: 136,
              borderRadius: 68,
              backgroundColor: "#ffffff",
              alignSelf: "center",
              marginTop: 4
            }}
          />

          <Text
            style={{
              color: "#ffffff",
              fontSize: 34,
              fontWeight: "800",
              textAlign: "center",
              marginTop: 16
            }}
          >
            {guideName}
          </Text>

          <View
            style={{
              alignSelf: "center",
              backgroundColor: "#22c1a1",
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 999,
              marginTop: 14
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
              {badgeText}
            </Text>
          </View>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 20,
              textAlign: "center",
              marginTop: 18
            }}
          >
            {guideLocation}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 24,
              paddingBottom: 4,
              gap: 10
            }}
          >
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 14,
                backgroundColor: "#dbeafe",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#0d4d92", fontWeight: "800" }}>Foto 1</Text>
            </View>

            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 14,
                backgroundColor: "#bfdbfe",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#0d4d92", fontWeight: "800" }}>Foto 2</Text>
            </View>

            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 14,
                backgroundColor: "#93c5fd",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#0d4d92", fontWeight: "800" }}>Foto 3</Text>
            </View>

            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 14,
                backgroundColor: "#60a5fa",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "800" }}>Foto 4</Text>
            </View>
          </ScrollView>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: "700",
              marginTop: 24
            }}
          >
            Bio
          </Text>

          <Text
            style={{
              color: "#e5eefb",
              fontSize: 20,
              lineHeight: 30,
              marginTop: 12
            }}
          >
            {guideBio}
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: "700",
              marginTop: 24
            }}
          >
            Idiomas
          </Text>

          <Text
            style={{
              color: "#dbeafe",
              fontSize: 18,
              marginTop: 10
            }}
          >
            {guideLanguagesText}
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: "700",
              marginTop: 24
            }}
          >
            Tarifas
          </Text>

          <View style={{ marginTop: 12, gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 18 }}>Por hora</Text>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
                USD {priceHour || 0}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 18 }}>Jornada 8h</Text>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
                USD {price8Hours || 0}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 18 }}>24 horas</Text>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
                USD {price24h || 0}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.20)",
            borderRadius: 20,
            padding: 18,
            backgroundColor: "rgba(255,255,255,0.08)",
            gap: 10
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "800" }}>
            Antes de reservar
          </Text>

          <Text style={{ color: "#e5eefb", fontSize: 16 }}>
            • Cada guía ofrece una experiencia personalizada según tus intereses
          </Text>
          <Text style={{ color: "#e5eefb", fontSize: 16 }}>
            • Podés coordinar directamente los detalles para adaptar el recorrido
          </Text>
          <Text style={{ color: "#e5eefb", fontSize: 16 }}>
            • Las tarifas corresponden al servicio del guía según la modalidad indicada
          </Text>
          <Text style={{ color: "#e5eefb", fontSize: 16 }}>
            • Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente
          </Text>
          <Text style={{ color: "#e5eefb", fontSize: 16 }}>
            • En actividades compartidas, el viajero cubre también los gastos del guía
          </Text>
          <Text style={{ color: "#e5eefb", fontSize: 16 }}>
            • Reservando a través de la plataforma asegurás una experiencia clara, segura y registrada
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/reservas",
              params: {
                guideId: selectedGuideId
              }
            })
          }
          style={{
            backgroundColor: "#12b8a6",
            borderRadius: 22,
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
            Solicitar servicio
          </Text>
        </Pressable>

        <Text
          style={{
            color: "#dbeafe",
            fontSize: 14,
            textAlign: "center"
          }}
        >
          El chat con el guía se habilita únicamente después del pago.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}