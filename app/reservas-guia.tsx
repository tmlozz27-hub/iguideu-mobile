import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { API_BASE } from "@/config/api";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    title: "Mis reservas",
    loading: "Cargando reservas...",
    emptyTitle: "Reservas del guia",
    empty: "Todavia no hay reservas pagadas para este guia.",
    booking: "Reserva",
    status: "Estado",
    traveler: "Viajero",
    total: "Total",
    openChat: "ABRIR CHAT",
    back: "Volver al perfil guia"
  },
  en: {
    title: "My bookings",
    loading: "Loading bookings...",
    emptyTitle: "Guide bookings",
    empty: "There are no paid bookings for this guide yet.",
    booking: "Booking",
    status: "Status",
    traveler: "Traveler",
    total: "Total",
    openChat: "OPEN CHAT",
    back: "Back to guide profile"
  }
};

export default function ReservasGuia() {
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"es" | "en">("es");

  const t = copy[lang];

  const loadLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);

    if (savedLang === "es" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    loadLang();
    loadBookings();
  }, [loadLang]);

  useFocusEffect(
    useCallback(() => {
      loadLang();
    }, [loadLang])
  );

  const loadBookings = async () => {
    try {
      setLoading(true);

      const token =
        (await AsyncStorage.getItem("iguideu_token")) || "";

      const response = await fetch(
        `${API_BASE}/api/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];

      setBookings(items);
    } catch (e) {
      console.log("GUIDE_BOOKINGS_ERROR", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
      }}
      style={{
        flex: 1,
        backgroundColor: "#0B3E91"
      }}
      resizeMode="cover"
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(11,62,145,0.74)"
        }}
      />

      <View
        style={{
          position: "absolute",
          top: -40,
          right: -20,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: "rgba(88,196,255,0.14)"
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 140,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: "rgba(18,184,166,0.10)"
        }}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 40
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: "900",
            textAlign: "center",
            marginBottom: 20,
            textShadowColor: "rgba(0,0,0,0.18)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8
          }}
        >
          {t.title}
        </Text>

        {loading ? (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              borderRadius: 22,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)"
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16
              }}
            >
              {t.loading}
            </Text>
          </View>
        ) : bookings.length === 0 ? (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              borderRadius: 22,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)"
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "800",
                marginBottom: 10
              }}
            >
              {t.emptyTitle}
            </Text>

            <Text
              style={{
                color: "#e5eefb",
                fontSize: 16
              }}
            >
              {t.empty}
            </Text>
          </View>
        ) : (
          bookings.map((booking, index) => (
            <View
              key={booking._id || index}
              style={{
                backgroundColor: "rgba(255,255,255,0.10)",
                borderRadius: 22,
                padding: 18,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)"
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "800",
                  marginBottom: 8
                }}
              >
                {t.booking} #{index + 1}
              </Text>

              <Text
                style={{
                  color: "#e5eefb",
                  marginBottom: 4
                }}
              >
                {t.status}: {booking.status || "PENDING"}
              </Text>

              <Text
                style={{
                  color: "#e5eefb",
                  marginBottom: 4
                }}
              >
                {t.traveler}: {booking.travelerEmail || "-"}
              </Text>

              <Text
                style={{
                  color: "#e5eefb",
                  marginBottom: 14
                }}
              >
                {t.total}: USD {booking.totalAmount || booking.amount || 0}
              </Text>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/chat",
                    params: {
                      bookingId: booking._id,
                    },
                  })
                }
                style={{
                  backgroundColor: "#12b8a6",
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: 16
                  }}
                >
                  {t.openChat}
                </Text>
              </Pressable>
            </View>
          ))
        )}

        <Pressable
          onPress={() => router.replace("/perfil-guia")}
          style={{
            backgroundColor: "rgba(47,95,147,0.96)",
            padding: 16,
            borderRadius: 14,
            marginTop: 12,
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              textAlign: "center",
              fontSize: 16
            }}
          >
            {t.back}
          </Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}