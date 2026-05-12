import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
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
    <View
      style={{
        flex: 1,
        backgroundColor: "#EAF3FF",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            color: "#173B6B",
            fontSize: 30,
            fontWeight: "900",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {t.title}
        </Text>

        {loading ? (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: 22,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "#173B6B",
                fontSize: 16,
              }}
            >
              {t.loading}
            </Text>
          </View>
        ) : bookings.length === 0 ? (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: 22,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "#173B6B",
                fontSize: 18,
                fontWeight: "800",
                marginBottom: 10,
              }}
            >
              {t.emptyTitle}
            </Text>

            <Text
              style={{
                color: "#173B6B",
                fontSize: 16,
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
                backgroundColor: "rgba(255,255,255,0.92)",
                borderRadius: 22,
                padding: 18,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: "#173B6B",
                  fontSize: 18,
                  fontWeight: "800",
                  marginBottom: 8,
                }}
              >
                {t.booking} #{index + 1}
              </Text>

              <Text
                style={{
                  color: "#173B6B",
                  marginBottom: 4,
                }}
              >
                {t.status}: {booking.status || "PENDING"}
              </Text>

              <Text
                style={{
                  color: "#173B6B",
                  marginBottom: 4,
                }}
              >
                {t.traveler}: {booking.travelerEmail || "-"}
              </Text>

              <Text
                style={{
                  color: "#173B6B",
                  marginBottom: 14,
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
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: 16,
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
            backgroundColor: "#173B6B",
            padding: 16,
            borderRadius: 16,
            marginTop: 12,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {t.back}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}