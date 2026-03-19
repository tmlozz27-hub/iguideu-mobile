import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGet } from "../config/api";

type Guide = {
  _id: string;
  id?: string;
  name?: string;
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
  const params = useLocalSearchParams<{ guideId?: string; id?: string }>();
  const guideId =
    typeof params.guideId === "string" && params.guideId.trim()
      ? params.guideId.trim()
      : typeof params.id === "string" && params.id.trim()
      ? params.id.trim()
      : "";

  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<Guide | null>(null);

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
          : Array.isArray((data as any)?.value)
          ? (data as any).value
          : [];

        const found =
          list.find((g: any) => String(g?._id || "") === guideId) ||
          list.find((g: any) => String(g?.id || "") === guideId) ||
          null;

        if (active) setGuide(found);
      } catch (error) {
        console.log("ERROR loading guide detail", error);
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
          flexGrow: 1,
          backgroundColor: "#0d4d92",
          padding: 24,
          gap: 18
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 22,
            fontWeight: "700",
            textAlign: "center",
            marginTop: 4
          }}
        >
          Perfil del guía
        </Text>

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.10)",
            borderRadius: 28,
            padding: 22,
            gap: 12
          }}
        >
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
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
              textAlign: "center"
            }}
          >
            {guide.name || "Guía"}
          </Text>

          <View
            style={{
              alignSelf: "center",
              backgroundColor: "#22c1a1",
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 999
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
              marginTop: 2
            }}
          >
            {[guide.city, guide.country].filter(Boolean).join(", ") || "-"}
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              textAlign: "center"
            }}
          >
            ★ {guide.rating ?? "-"}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 8,
              paddingBottom: 4,
              gap: 10
            }}
          >
            <View
              style={{
                width: 78,
                height: 78,
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
                width: 78,
                height: 78,
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
                width: 78,
                height: 78,
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
                width: 78,
                height: 78,
                borderRadius: 14,
                backgroundColor: "#60a5fa",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "800" }}>Foto 4</Text>
            </View>

            <View
              style={{
                width: 96,
                height: 78,
                borderRadius: 14,
                backgroundColor: "#111827",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#22c1a1"
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "800" }}>▶</Text>
              <Text style={{ color: "#dbeafe", fontSize: 12, marginTop: 4 }}>Video 0:45</Text>
            </View>
          </ScrollView>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: "700",
              marginTop: 8
            }}
          >
            About me
          </Text>

          <Text
            style={{
              color: "#e5eefb",
              fontSize: 20,
              lineHeight: 30
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
                guideId: guide._id
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