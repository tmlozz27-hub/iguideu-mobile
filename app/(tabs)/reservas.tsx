import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import { apiGet, apiPost } from "../../config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

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
  guideType?: string;
};

type Booking = {
  _id: string;
  travelerEmail?: string;
  email?: string;
  date?: string;
  hours?: number;
  amount?: number;
  amountUsd?: number;
  amountCents?: number;
  totalAmount?: number;
  status?: string;
  guideName?: string;
};

function todayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

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
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const params = useLocalSearchParams<{ guideId?: string }>();
  const lockedGuideId = typeof params.guideId === "string" ? params.guideId : "";

  const [travelerEmail, setTravelerEmail] = useState("");
  const [date, setDate] = useState(todayString());
  const [hours, setHours] = useState("1");
  const [adults, setAdults] = useState("1");
  const [youth, setYouth] = useState("0");
  const [children, setChildren] = useState("0");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState(lockedGuideId);
  const [loading, setLoading] = useState(false);
  const [lastPaidBookingId, setLastPaidBookingId] = useState("");

  async function loadGuides() {
    const data = await apiGet("/api/guides");
    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.guides)
        ? (data as any).guides
        : Array.isArray((data as any)?.items)
          ? (data as any).items
          : [];
    setGuides(list);

    if (lockedGuideId) {
      setSelectedGuideId(lockedGuideId);
      return;
    }

    setSelectedGuideId("");
  }

  async function loadBookings() {
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
    const paidOnly = list.filter((item: Booking) => String(item.status || "").toUpperCase() === "PAID");
    setBookings(paidOnly);
  }

  async function refreshAll() {
    try {
      setLoading(true);

      const savedEmail = String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "").trim().toLowerCase();
      if (savedEmail) {
        setTravelerEmail(savedEmail);
      }

      await loadGuides();
      await loadBookings();
    } catch (error: any) {
      console.log("ERROR refresh reservas", error);
      Alert.alert("Error", error?.message || "No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (lockedGuideId) {
      setSelectedGuideId(lockedGuideId);
    }
  }, [lockedGuideId]);

  const selectedGuide = useMemo(() => {
    return guides.find((g) => g._id === selectedGuideId) || null;
  }, [guides, selectedGuideId]);

  const selectedPriceHour = useMemo(() => {
    return Number(selectedGuide?.priceHour ?? selectedGuide?.pricePerHour ?? 0);
  }, [selectedGuide]);

  const adultsCount = useMemo(() => {
    const n = Number(adults || 0);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
  }, [adults]);

  const youthCount = useMemo(() => {
    const n = Number(youth || 0);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
  }, [youth]);

  const childrenCount = useMemo(() => {
    const n = Number(children || 0);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
  }, [children]);

  const travelersCount = useMemo(() => {
    return adultsCount + youthCount + childrenCount;
  }, [adultsCount, youthCount, childrenCount]);

  const youthPriceHour = useMemo(() => {
    return Number((selectedPriceHour * 0.5).toFixed(2));
  }, [selectedPriceHour]);

  const totalAmount = useMemo(() => {
    const h = Number(hours || 0);
    if (!Number.isFinite(h) || h <= 0) return 0;
    const adultTotal = adultsCount * selectedPriceHour * h;
    const youthTotal = youthCount * youthPriceHour * h;
    return Number((adultTotal + youthTotal).toFixed(2));
  }, [hours, adultsCount, youthCount, selectedPriceHour, youthPriceHour]);

  const totalAmountCents = useMemo(() => {
    return Math.round(totalAmount * 100);
  }, [totalAmount]);

  async function createBooking() {
    if (loading) return;

    try {
      setLoading(true);
      setLastPaidBookingId("");

      const headers = await getAuthHeaders();
      const h = Number(hours);
      const emailClean = String(travelerEmail || "").trim().toLowerCase();

      if (!headers) {
        Alert.alert("Error", "No hay sesión activa. Volvé a iniciar sesión.");
        return;
      }

      if (!emailClean) {
        Alert.alert("Error", "Falta el email del viajero.");
        return;
      }

      if (!date.trim()) {
        Alert.alert("Error", "Ingresá fecha.");
        return;
      }

      if (!selectedGuideId) {
        Alert.alert("Error", "Primero elegí un guía.");
        return;
      }

      if (!Number.isFinite(h) || h <= 0) {
        Alert.alert("Error", "Ingresá horas válidas.");
        return;
      }

      if (travelersCount <= 0) {
        Alert.alert("Error", "Ingresá al menos 1 viajero.");
        return;
      }

      const created = await apiPost(
        "/api/bookings",
        {
          travelerEmail: emailClean,
          date: date.trim(),
          hours: h,
          guideId: selectedGuideId,
          adults: adultsCount,
          youth: youthCount,
          children: childrenCount,
          travelersCount,
          price: totalAmount,
          amount: totalAmount,
          totalAmount,
          amountCents: totalAmountCents
        },
        headers
      );

      const bookingId =
        (created as any)?._id ||
        (created as any)?.booking?._id ||
        (created as any)?.id;

      if (!bookingId) {
        Alert.alert("Error", "La reserva se creó pero no volvió el bookingId.");
        await loadBookings();
        return;
      }

      const intentResponse = await apiPost(
        "/api/payments/create-intent",
        { bookingId },
        headers
      );

      const clientSecret = String(intentResponse?.clientSecret || "").trim();

      if (!clientSecret) {
        Alert.alert("Error", "No se pudo iniciar el pago.");
        await loadBookings();
        return;
      }

      const init = await initPaymentSheet({
        merchantDisplayName: "I GUIDE U",
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          email: emailClean
        }
      });

      if (init.error) {
        Alert.alert("Error", init.error.message || "No se pudo preparar el pago.");
        return;
      }

      const result = await presentPaymentSheet();

      if (result.error) {
        Alert.alert("Pago no completado", result.error.message || "El pago fue cancelado.");
        return;
      }

      setLastPaidBookingId(String(bookingId));
      Alert.alert("OK", "Pago realizado correctamente.");
      await loadBookings();
    } catch (error: any) {
      console.log("ERROR createBooking()", error);
      Alert.alert("Error", error?.message || "No se pudo crear la reserva.");
    } finally {
      setLoading(false);
    }
  }

  const showReservationForm = !!selectedGuide;

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
      }}
      style={{ flex: 1, backgroundColor: "#76A9E8" }}
      resizeMode="cover"
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(90,136,204,0.44)"
        }}
      />
      <View
        style={{
          position: "absolute",
          top: -20,
          right: -10,
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: "rgba(255,255,255,0.10)"
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 120,
          left: -30,
          width: 170,
          height: 170,
          borderRadius: 85,
          backgroundColor: "rgba(168,240,233,0.14)"
        }}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#15539A",
            textAlign: "center",
            marginBottom: 2,
            textShadowColor: "rgba(0,0,0,0.12)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 6
          }}
        >
          Reservas
        </Text>

        {!showReservationForm ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.20)",
              borderRadius: 24,
              padding: 18,
              backgroundColor: "rgba(255,255,255,0.16)",
              gap: 10
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#15539A" }}>
              Todavía no elegiste un guía
            </Text>
            <Text style={{ fontSize: 16, color: "#173B6B", lineHeight: 24 }}>
              Primero elegí un guía desde Buscar guías por país o Guías cercanos.
            </Text>

            <Pressable
              onPress={() => router.push("/buscar-pais")}
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.24)",
                borderRadius: 20,
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
                backgroundColor: "rgba(255,255,255,0.18)"
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#ffffff" }}>
                IR A BUSCAR GUÍAS
              </Text>
            </Pressable>
          </View>
        ) : null}

        {showReservationForm ? (
          <>
            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>Traveler Email</Text>
            <TextInput
              value={travelerEmail}
              onChangeText={setTravelerEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 16,
                backgroundColor: "rgba(255,255,255,0.92)",
                color: "#111827"
              }}
            />

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>Fecha</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#6b7280"
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 16,
                backgroundColor: "rgba(255,255,255,0.96)",
                color: "#111827"
              }}
            />

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>Guía</Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                borderRadius: 22,
                paddingHorizontal: 16,
                paddingVertical: 18,
                backgroundColor: "rgba(77,118,181,0.34)"
              }}
            >
              <Text style={{ color: "#15539A", fontSize: 18, fontWeight: "800" }}>
                {selectedGuide.name} — {[selectedGuide.city, selectedGuide.country].filter(Boolean).join(", ")}
              </Text>
              <Text style={{ color: "#173B6B", marginTop: 8, fontSize: 15 }}>
                Guía seleccionada desde el perfil
              </Text>
            </View>

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>Horas</Text>
            <TextInput
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
              style={{
                width: 120,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 16,
                backgroundColor: "rgba(255,255,255,0.96)",
                color: "#111827"
              }}
            />

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>Adultos (18+)</Text>
            <TextInput
              value={adults}
              onChangeText={setAdults}
              keyboardType="numeric"
              style={{
                width: 120,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 16,
                backgroundColor: "rgba(255,255,255,0.96)",
                color: "#111827"
              }}
            />

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>Jóvenes (13 a 17)</Text>
            <TextInput
              value={youth}
              onChangeText={setYouth}
              keyboardType="numeric"
              style={{
                width: 120,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 16,
                backgroundColor: "rgba(255,255,255,0.96)",
                color: "#111827"
              }}
            />

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>Niños (0 a 12)</Text>
            <TextInput
              value={children}
              onChangeText={setChildren}
              keyboardType="numeric"
              style={{
                width: 120,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 18,
                fontSize: 16,
                backgroundColor: "rgba(255,255,255,0.96)",
                color: "#111827"
              }}
            />

            <View
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                borderRadius: 24,
                padding: 18,
                backgroundColor: "rgba(255,255,255,0.16)",
                gap: 7
              }}
            >
              <Text style={{ fontWeight: "800", fontSize: 18, color: "#15539A" }}>Resumen</Text>
              <Text style={{ color: "#173B6B" }}>Guía: {selectedGuide?.name || "-"}</Text>
              <Text style={{ color: "#173B6B" }}>Fecha: {date}</Text>
              <Text style={{ color: "#173B6B" }}>Horas: {hours}</Text>
              <Text style={{ color: "#173B6B" }}>Adultos (18+): {adultsCount}</Text>
              <Text style={{ color: "#173B6B" }}>Jóvenes (13 a 17): {youthCount}</Text>
              <Text style={{ color: "#173B6B" }}>Niños (0 a 12): {childrenCount}</Text>
              <Text style={{ color: "#173B6B" }}>Total viajeros: {travelersCount}</Text>
              <Text style={{ color: "#173B6B" }}>Precio adulto/hora: USD {selectedPriceHour || 0}</Text>
              <Text style={{ color: "#173B6B" }}>Precio joven/hora: USD {youthPriceHour.toFixed(2)}</Text>
              <Text style={{ color: "#173B6B" }}>Niños (0 a 12): sin cargo</Text>
              <Text style={{ color: "#15539A", fontWeight: "800", marginTop: 4 }}>
                Total: USD {totalAmount.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                borderRadius: 24,
                padding: 18,
                backgroundColor: "rgba(255,255,255,0.16)",
                gap: 8
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#15539A" }}>
                Antes de confirmar tu reserva
              </Text>

              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • La tarifa corresponde únicamente al servicio del guía según la modalidad indicada y se calcula por viajero según edad
              </Text>
              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente
              </Text>
              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • En actividades compartidas, el viajero cubre también los gastos del guía
              </Text>
              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • Podés cancelar sin costo con más de 24 horas de anticipación
              </Text>
              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • Si surge un imprevisto, podés coordinar directamente con tu guía un cambio de horario o fecha
              </Text>
              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • Las horas adicionales se acuerdan con el guía y se cobran según la tarifa publicada
              </Text>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                borderRadius: 24,
                padding: 18,
                backgroundColor: "rgba(255,255,255,0.14)",
                gap: 8
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#15539A" }}>
                Confirmación
              </Text>

              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • Confirmo que revisé la tarifa, duración y condiciones de esta reserva
              </Text>
              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • Confirmo que los gastos adicionales no están incluidos salvo que se indique expresamente
              </Text>
              <Text style={{ color: "#173B6B", lineHeight: 23 }}>
                • Confirmo que leí las condiciones de cancelación, cambios e imprevistos
              </Text>

              <Text style={{ marginTop: 6, fontSize: 14, color: "#173B6B" }}>
                Pago seguro · Reserva registrada · Mayor transparencia para ambas partes
              </Text>
            </View>

            <Pressable
              onPress={createBooking}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#8c96a7" : "#1cc9b7",
                paddingVertical: 18,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "800" }}>
                {loading ? "Cargando..." : "PAGAR AHORA"}
              </Text>
            </Pressable>

            {lastPaidBookingId ? (
              <Pressable
                onPress={() => router.push({ pathname: "/chat", params: { bookingId: lastPaidBookingId } })}
                style={{
                  backgroundColor: "rgba(106,145,205,0.92)",
                  paddingVertical: 18,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "800" }}>
                  ABRIR CHAT
                </Text>
              </Pressable>
            ) : null}

            <Text style={{ fontSize: 15, textAlign: "center", color: "#173B6B", lineHeight: 22 }}>
              Tu información de contacto se compartirá solo después del pago
            </Text>
          </>
        ) : null}

        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            marginTop: 12,
            color: "#15539A",
            textAlign: "center",
            textShadowColor: "rgba(0,0,0,0.12)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 6
          }}
        >
          Mis reservas
        </Text>

        {bookings.length === 0 ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)",
              borderRadius: 24,
              padding: 18,
              backgroundColor: "rgba(255,255,255,0.16)"
            }}
          >
            <Text style={{ fontSize: 16, color: "#173B6B", lineHeight: 24 }}>
              Todavía no hay reservas pagadas.
            </Text>
          </View>
        ) : null}

        {bookings.map((booking) => {
          const amount = booking.amount ?? booking.amountUsd ?? booking.totalAmount ?? 0;

          return (
            <View
              key={booking._id}
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                borderRadius: 24,
                padding: 18,
                backgroundColor: "rgba(255,255,255,0.16)",
                gap: 6
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#15539A" }}>
                {booking.guideName || "Guía"}
              </Text>
              <Text style={{ color: "#173B6B" }}>Email: {booking.travelerEmail || booking.email || "-"}</Text>
              <Text style={{ color: "#173B6B" }}>Fecha: {booking.date || "-"}</Text>
              <Text style={{ color: "#173B6B" }}>Horas: {booking.hours ?? "-"}</Text>
              <Text style={{ color: "#173B6B" }}>Monto: USD {Number(amount || 0).toFixed(2)}</Text>
              <Text style={{ color: "#15539A", fontWeight: "800" }}>Estado: {booking.status || "-"}</Text>
            </View>
          );
        })}

        <View style={{ height: 36 }} />
      </ScrollView>
    </ImageBackground>
  );
}