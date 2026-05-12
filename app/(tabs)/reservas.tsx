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
import { apiGet } from "../../config/api";

const TOKEN_KEY = "iguideu_token";
const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    title: "Reservas",
    empty: "Todavía no hay reservas pagadas.",
    guide: "Guía",
    date: "Fecha",
    hours: "Horas",
    amount: "Monto",
    status: "Estado",
    openChat: "ABRIR CHAT"
  },
  en: {
    title: "Bookings",
    empty: "There are no paid bookings yet.",
    guide: "Guide",
    date: "Date",
    hours: "Hours",
    amount: "Amount",
    status: "Status",
    openChat: "OPEN CHAT"
  }
};

type Booking = {
  _id: string;
  travelerEmail?: string;
  email?: string;
  date?: string;
  hours?: number;
  amount?: number;
  amountUsd?: number;
  totalAmount?: number;
  status?: string;
  guideName?: string;
};

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

export default function ReservasScreen() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lang, setLang] = useState<"es" | "en">("es");
  const t = copy[lang];

  const loadLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);
    if (savedLang === "es" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  async function loadBookings() {
    try {
      const headers = await getAuthHeaders();

      if (!headers) {
        setBookings([]);
        return;
      }

      const data = await apiGet("/api/bookings", headers);

      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.items)
          ? (data as any).items
          : [];

      const paidOnly = list.filter(
        (item: Booking) =>
          String(item.status || "").toUpperCase() === "PAID"
      );

      setBookings(paidOnly);
    } catch (error) {
      console.log("ERROR loadBookings", error);
      setBookings([]);
    }
  }

  useEffect(() => {
    loadLang();
    loadBookings();
  }, [loadLang]);

  useFocusEffect(
    useCallback(() => {
      loadLang();
    }, [loadLang])
  );

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "800",
            color: "#15539A",
            textAlign: "center",
            marginTop: 20,
            marginBottom: 28
          }}
        >
          {t.title}
        </Text>

        {bookings.length === 0 ? (
          <View
            style={{
              borderRadius: 24,
              padding: 18,
              backgroundColor: "rgba(255,255,255,0.18)"
            }}
          >
            <Text
              style={{
                color: "#173B6B",
                fontSize: 16,
                textAlign: "center"
              }}
            >
              {t.empty}
            </Text>
          </View>
        ) : null}

        {bookings.map((booking) => {
          const amount =
            booking.amount ??
            booking.amountUsd ??
            booking.totalAmount ??
            0;

          return (
            <View
              key={booking._id}
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                borderRadius: 24,
                padding: 18,
                backgroundColor: "rgba(255,255,255,0.16)",
                gap: 6,
                marginBottom: 18
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#15539A"
                }}
              >
                {booking.guideName || t.guide}
              </Text>

              <Text style={{ color: "#173B6B" }}>
                Email: {booking.travelerEmail || booking.email || "-"}
              </Text>

              <Text style={{ color: "#173B6B" }}>
                {t.date}: {booking.date || "-"}
              </Text>

              <Text style={{ color: "#173B6B" }}>
                {t.hours}: {booking.hours ?? "-"}
              </Text>

              <Text style={{ color: "#173B6B" }}>
                {t.amount}: USD {Number(amount || 0).toFixed(2)}
              </Text>

              <Text
                style={{
                  color: "#15539A",
                  fontWeight: "800"
                }}
              >
                {t.status}: {booking.status || "-"}
              </Text>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/chat",
                    params: { bookingId: booking._id }
                  })
                }
                style={{
                  marginTop: 10,
                  backgroundColor: "rgba(106,145,205,0.92)",
                  paddingVertical: 14,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "800"
                  }}
                >
                  {t.openChat}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}