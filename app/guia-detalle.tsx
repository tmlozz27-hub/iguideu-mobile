import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View, ImageBackground } from "react-native";
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

type GalleryItem = {
  key: string;
  label: string;
  image: string;
  isVideo?: boolean;
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
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

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

  const galleryItems = useMemo<GalleryItem[]>(
    () => [
      {
        key: "photo-1",
        label: "Islas",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        key: "photo-2",
        label: "Playa",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
      },
      {
        key: "photo-3",
        label: "Bosque",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        key: "photo-4",
        label: "Montaña",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      },
      {
        key: "video-45s",
        label: "Video 45s",
        image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
        isVideo: true,
      },
    ],
    []
  );

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
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80" }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, backgroundColor: "rgba(7,28,56,0.72)" }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
              <View
                style={{
                  minWidth: 220,
                  borderRadius: 28,
                  paddingHorizontal: 28,
                  paddingVertical: 24,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.16)",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={{ color: "#dbeafe", fontSize: 15, fontWeight: "700", marginTop: 14 }}>
                  Cargando perfil...
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    );
  }

  if (!guide) {
    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80" }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, backgroundColor: "rgba(7,28,56,0.76)" }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
              <View
                style={{
                  width: "100%",
                  borderRadius: 28,
                  padding: 26,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.16)",
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800", textAlign: "center" }}>
                  No se encontró el guía
                </Text>
                <Text style={{ marginTop: 10, color: "#dbeafe", fontSize: 14, textAlign: "center" }}>
                  guideId: {guideId || "-"}
                </Text>
                <Pressable
                  onPress={() => router.back()}
                  style={{
                    marginTop: 18,
                    alignSelf: "center",
                    backgroundColor: "rgba(255,255,255,0.16)",
                    borderRadius: 999,
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>Volver</Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, backgroundColor: "rgba(7,28,56,0.68)" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 34,
              gap: 18,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                overflow: "hidden",
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                backgroundColor: "rgba(255,255,255,0.10)",
              }}
            >
              <ImageBackground
                source={{
                  uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
                }}
                style={{ minHeight: 560, justifyContent: "space-between" }}
                resizeMode="cover"
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(4,19,39,0.48)",
                    padding: 22,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Pressable
                      onPress={() => router.back()}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.14)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.20)",
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>Volver</Text>
                    </Pressable>

                    <View
                      style={{
                        backgroundColor: "#0C6CF2",
                        paddingHorizontal: 16,
                        paddingVertical: 9,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.18)",
                      }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "900", letterSpacing: 0.8 }}>
                        {badgeText}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <View
                      style={{
                        width: 138,
                        height: 138,
                        borderRadius: 69,
                        alignSelf: "center",
                        marginBottom: 18,
                        borderWidth: 3,
                        borderColor: "rgba(255,255,255,0.92)",
                        backgroundColor: "rgba(255,255,255,0.18)",
                        overflow: "hidden",
                      }}
                    >
                      <ImageBackground
                        source={{
                          uri:
                            guide.avatarUrl ||
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
                        }}
                        style={{ flex: 1 }}
                        resizeMode="cover"
                      />
                    </View>

                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 32,
                        fontWeight: "800",
                        textAlign: "center",
                      }}
                    >
                      {guideName}
                    </Text>

                    <Text
                      style={{
                        color: "#dbeafe",
                        fontSize: 17,
                        fontWeight: "600",
                        textAlign: "center",
                        marginTop: 10,
                      }}
                    >
                      {guideLocation}
                    </Text>

                    <View
                      style={{
                        alignSelf: "center",
                        marginTop: 14,
                        backgroundColor: "rgba(255,255,255,0.14)",
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#dbeafe", fontSize: 14, fontWeight: "800" }}>
                        {guide.rating ? `⭐ ${guide.rating}` : "Perfil verificado"}
                      </Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>

            <View
              style={{
                borderRadius: 28,
                padding: 22,
                backgroundColor: "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
              }}
            >
              <Text style={{ color: "#93c5fd", fontSize: 22, fontWeight: "900" }}>Galería</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: 18,
                  paddingBottom: 2,
                  gap: 12,
                }}
              >
                {galleryItems.map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => setSelectedMedia(item)}
                    style={{
                      width: 108,
                      height: 108,
                      borderRadius: 20,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.18)",
                    }}
                  >
                    <ImageBackground
                      source={{ uri: item.image }}
                      style={{ flex: 1, justifyContent: "flex-end" }}
                      resizeMode="cover"
                    >
                      <View
                        style={{
                          backgroundColor: "rgba(4,22,44,0.48)",
                          paddingHorizontal: 8,
                          paddingVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "#ffffff",
                            fontWeight: "800",
                            textAlign: "center",
                            fontSize: 13,
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    </ImageBackground>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                borderRadius: 28,
                padding: 22,
                backgroundColor: "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
              }}
            >
              <Text style={{ color: "#93c5fd", fontSize: 22, fontWeight: "900" }}>Bio</Text>

              <Text
                style={{
                  color: "#f8fbff",
                  fontSize: 17,
                  lineHeight: 28,
                  marginTop: 12,
                }}
              >
                {guideBio}
              </Text>
            </View>

            <View
              style={{
                borderRadius: 28,
                padding: 22,
                backgroundColor: "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
              }}
            >
              <Text style={{ color: "#93c5fd", fontSize: 22, fontWeight: "900" }}>Idiomas</Text>

              <Text
                style={{
                  color: "#dbeafe",
                  fontSize: 17,
                  marginTop: 12,
                  lineHeight: 26,
                }}
              >
                {guideLanguagesText}
              </Text>
            </View>

            <View
              style={{
                borderRadius: 28,
                padding: 22,
                backgroundColor: "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
              }}
            >
              <Text style={{ color: "#93c5fd", fontSize: 22, fontWeight: "900" }}>Tarifas</Text>

              <View style={{ marginTop: 16, gap: 12 }}>
                <View
                  style={{
                    borderRadius: 18,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#eaf4ff", fontSize: 17, fontWeight: "600" }}>Por hora</Text>
                  <Text style={{ color: "#93c5fd", fontSize: 19, fontWeight: "900" }}>
                    USD {priceHour || 0}
                  </Text>
                </View>

                <View
                  style={{
                    borderRadius: 18,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#eaf4ff", fontSize: 17, fontWeight: "600" }}>Jornada 8h</Text>
                  <Text style={{ color: "#93c5fd", fontSize: 19, fontWeight: "900" }}>
                    USD {price8Hours || 0}
                  </Text>
                </View>

                <View
                  style={{
                    borderRadius: 18,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#eaf4ff", fontSize: 17, fontWeight: "600" }}>24 horas</Text>
                  <Text style={{ color: "#93c5fd", fontSize: 19, fontWeight: "900" }}>
                    USD {price24h || 0}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                borderRadius: 28,
                padding: 20,
                backgroundColor: "rgba(255,255,255,0.10)",
                gap: 10,
              }}
            >
              <Text style={{ color: "#93c5fd", fontSize: 21, fontWeight: "900" }}>
                Antes de reservar
              </Text>

              <Text style={{ color: "#eef6ff", fontSize: 16, lineHeight: 24 }}>
                • Cada guía ofrece una experiencia personalizada según tus intereses
              </Text>
              <Text style={{ color: "#eef6ff", fontSize: 16, lineHeight: 24 }}>
                • Podés coordinar directamente los detalles para adaptar el recorrido
              </Text>
              <Text style={{ color: "#eef6ff", fontSize: 16, lineHeight: 24 }}>
                • Las tarifas corresponden al servicio del guía según la modalidad indicada
              </Text>
              <Text style={{ color: "#eef6ff", fontSize: 16, lineHeight: 24 }}>
                • Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente
              </Text>
              <Text style={{ color: "#eef6ff", fontSize: 16, lineHeight: 24 }}>
                • En actividades compartidas, el viajero cubre también los gastos del guía
              </Text>
              <Text style={{ color: "#eef6ff", fontSize: 16, lineHeight: 24 }}>
                • Reservando a través de la plataforma asegurás una experiencia clara, segura y registrada
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/reservas",
                  params: {
                    guideId: selectedGuideId,
                  },
                })
              }
              style={{
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80" }}
                style={{ minHeight: 78, justifyContent: "center" }}
                resizeMode="cover"
              >
                <View
                  style={{
                    backgroundColor: "rgba(12,108,242,0.82)",
                    minHeight: 78,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "900" }}>
                    Solicitar servicio
                  </Text>
                </View>
              </ImageBackground>
            </Pressable>

            <Text
              style={{
                color: "#dbeafe",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              El chat con el guía se habilita únicamente después del pago.
            </Text>
          </ScrollView>

          <Modal
            visible={!!selectedMedia}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedMedia(null)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.88)",
                justifyContent: "center",
                alignItems: "center",
                padding: 24,
              }}
            >
              <Pressable
                onPress={() => setSelectedMedia(null)}
                style={{
                  position: "absolute",
                  top: 56,
                  right: 24,
                  zIndex: 2,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "800" }}>
                  Cerrar
                </Text>
              </Pressable>

              <View
                style={{
                  width: "100%",
                  maxWidth: 390,
                  borderRadius: 28,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.18)",
                }}
              >
                <ImageBackground
                  source={{ uri: selectedMedia?.image }}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    justifyContent: "flex-end",
                  }}
                  resizeMode="cover"
                >
                  <View
                    style={{
                      backgroundColor: "rgba(4,22,44,0.56)",
                      paddingHorizontal: 20,
                      paddingVertical: 18,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 28,
                        fontWeight: "900",
                        textAlign: "center",
                      }}
                    >
                      {selectedMedia?.label || ""}
                    </Text>

                    {!!selectedMedia?.isVideo && (
                      <Text
                        style={{
                          color: "#dbeafe",
                          fontSize: 15,
                          textAlign: "center",
                          marginTop: 10,
                        }}
                      >
                        Vista ampliada del video de 45 segundos
                      </Text>
                    )}
                  </View>
                </ImageBackground>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
