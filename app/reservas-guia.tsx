import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "@/config/api";

export default function ReservasGuia() {
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

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
          Mis reservas
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
              Cargando reservas...
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
              Reservas del guía
            </Text>

            <Text
              style={{
                color: "#173B6B",
                fontSize: 16,
              }}
            >
              Todavía no hay reservas pagadas para este guía.
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
                Reserva #{index + 1}
              </Text>

              <Text
                style={{
                  color: "#173B6B",
                  marginBottom: 4,
                }}
              >
                Estado: {booking.status || "PENDING"}
              </Text>

              <Text
                style={{
                  color: "#173B6B",
                  marginBottom: 4,
                }}
              >
                Traveler: {booking.travelerEmail || "-"}
              </Text>

              <Text
                style={{
                  color: "#173B6B",
                  marginBottom: 14,
                }}
              >
                Total: USD {booking.totalAmount || booking.amount || 0}
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
                  ABRIR CHAT
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
            Volver al perfil guía
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}