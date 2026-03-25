import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    throw new Error("No hay sesión activa. Volvé a iniciar sesión.");
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

export default function ReservasScreen() {
  const params = useLocalSearchParams<{ guideId?: string }>();
  const lockedGuideId = typeof params.guideId === "string" ? params.guideId : "";

  const [travelerEmail, setTravelerEmail] = useState("");
  const [date, setDate] = useState(todayString());
  const [hours, setHours] = useState("1");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState(lockedGuideId);
  const [loading, setLoading] = useState(false);

  async function loadGuides() {
    const data = await apiGet("/api/guides");
    const list = Array.isArray(data) ? data : Array.isArray((data as any)?.guides) ? (data as any).guides : [];
    setGuides(list);

    if (lockedGuideId) {
      setSelectedGuideId(lockedGuideId);
      return;
    }

    setSelectedGuideId("");
  }

  async function loadBookings() {
    const headers = await getAuthHeaders();
    const savedEmail = String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "").trim().toLowerCase();
    const email = String(travelerEmail || savedEmail || "").trim().toLowerCase();

    const path = email
      ? `/api/bookings?travelerEmail=${encodeURIComponent(email)}`
      : "/api/bookings";

    const data = await apiGet(path, headers);
    const list = Array.isArray(data) ? data : Array.isArray((data as any)?.items) ? (data as any).items : [];
    setBookings(list);
  }

  async function refreshAll() {
    try {
      setLoading(true);

      const savedEmail = String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "").trim().toLowerCase();
      if (savedEmail) {
        setTravelerEmail(savedEmail);
      }

      await Promise.all([loadGuides(), loadBookings()]);
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

  const totalAmount = useMemo(() => {
    const h = Number(hours || 0);
    if (!Number.isFinite(h) || h <= 0) return 0;
    return Number((selectedPriceHour * h).toFixed(2));
  }, [hours, selectedPriceHour]);

  const totalAmountCents = useMemo(() => {
    return Math.round(totalAmount * 100);
  }, [totalAmount]);

  async function createBooking() {
    if (loading) return;

    try {
      setLoading(true);

      const headers = await getAuthHeaders();
      const h = Number(hours);
      const savedEmail = String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "").trim().toLowerCase();
      const emailClean = String(travelerEmail || savedEmail || "").trim().toLowerCase();

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

      await apiPost(
        "/api/bookings",
        {
          travelerEmail: emailClean,
          date: date.trim(),
          hours: h,
          guideId: selectedGuideId,
          totalAmount,
          amount: totalAmount,
          amountCents: totalAmountCents
        },
        headers
      );

      Alert.alert("OK", "Reserva creada correctamente.");
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Reservas</Text>

      {!showReservationForm ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#ffffff",
            gap: 10
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Todavía no elegiste un guía</Text>
          <Text style={{ fontSize: 16, color: "#4b5563" }}>
            Primero elegí un guía desde Buscar guías por país o Guías cercanos.
          </Text>

          <Pressable
            onPress={() => router.push("/buscar-pais")}
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>IR A BUSCAR GUÍAS</Text>
          </Pressable>
        </View>
      ) : null}

      {showReservationForm ? (
        <>
          <Text style={{ fontSize: 16 }}>Traveler Email</Text>
          <TextInput
            value={travelerEmail}
            onChangeText={setTravelerEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={false}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 18,
              fontSize: 16,
              backgroundColor: "#f3f4f6",
              color: "#111827"
            }}
          />

          <Text style={{ fontSize: 16 }}>Fecha</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 18,
              fontSize: 16,
              backgroundColor: "#ffffff"
            }}
          />

          <Text style={{ fontSize: 16 }}>Guía</Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 18,
              backgroundColor: "#000000"
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
              {selectedGuide.name} — {[selectedGuide.city, selectedGuide.country].filter(Boolean).join(", ")}
            </Text>
            <Text style={{ color: "#d1d5db", marginTop: 8, fontSize: 16 }}>
              Guía seleccionada desde el perfil
            </Text>
          </View>

          <Text style={{ fontSize: 16 }}>Horas</Text>
          <TextInput
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
            style={{
              width: 120,
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 18,
              fontSize: 16,
              backgroundColor: "#ffffff"
            }}
          />

          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 20,
              padding: 18,
              backgroundColor: "#ffffff",
              gap: 8
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>Resumen</Text>
            <Text style={{ fontSize: 16 }}>Guía: {selectedGuide.name}</Text>
            <Text style={{ fontSize: 16 }}>Fecha: {date}</Text>
            <Text style={{ fontSize: 16 }}>Horas: {hours}</Text>
            <Text style={{ fontSize: 16 }}>Precio/hora: USD {selectedPriceHour}</Text>
            <Text style={{ fontSize: 16 }}>Total: USD {totalAmount.toFixed(2)}</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 20,
              padding: 18,
              backgroundColor: "#ffffff",
              gap: 10
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>Antes de confirmar tu reserva</Text>
            <Text style={{ fontSize: 16 }}>• La tarifa corresponde únicamente al servicio del guía según la modalidad indicada</Text>
            <Text style={{ fontSize: 16 }}>• Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente</Text>
            <Text style={{ fontSize: 16 }}>• En actividades compartidas, el viajero cubre también los gastos del guía</Text>
            <Text style={{ fontSize: 16 }}>• Podés cancelar sin costo con más de 24 horas de anticipación</Text>
            <Text style={{ fontSize: 16 }}>• Si surge un imprevisto, podés coordinar directamente con tu guía un cambio de horario o fecha</Text>
            <Text style={{ fontSize: 16 }}>• Las horas adicionales se acuerdan con el guía y se cobran según la tarifa publicada</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 20,
              padding: 18,
              backgroundColor: "#ffffff",
              gap: 10
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>Confirmación</Text>
            <Text style={{ fontSize: 16 }}>• Confirmo que revisé la tarifa, duración y condiciones de esta reserva</Text>
            <Text style={{ fontSize: 16 }}>• Confirmo que los gastos adicionales no están incluidos salvo que se indique expresamente</Text>
          </View>

          <Pressable
            onPress={createBooking}
            disabled={loading}
            style={{
              backgroundColor: "#000000",
              borderRadius: 18,
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.7 : 1
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
              {loading ? "PROCESANDO..." : "CONFIRMAR RESERVA"}
            </Text>
          </Pressable>

          <Text
            style={{
              textAlign: "center",
              color: "#374151",
              fontSize: 15
            }}
          >
            Tu información de contacto se compartirá solo después del pago
          </Text>
        </>
      ) : null}

      <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 10 }}>Mis reservas</Text>

      {bookings.length === 0 ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#ffffff"
          }}
        >
          <Text style={{ fontSize: 16, color: "#6b7280" }}>Todavía no hay reservas.</Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {bookings.map((item) => (
            <View
              key={item._id}
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 16,
                padding: 16,
                backgroundColor: "#ffffff",
                gap: 6
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.guideName || "Reserva"}</Text>
              <Text style={{ fontSize: 15 }}>Fecha: {item.date || "-"}</Text>
              <Text style={{ fontSize: 15 }}>Horas: {item.hours ?? "-"}</Text>
              <Text style={{ fontSize: 15 }}>
                Total: USD {Number(item.totalAmount ?? item.amount ?? item.amountUsd ?? 0).toFixed(2)}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "700" }}>
                Estado: {String(item.status || "PENDING").toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}