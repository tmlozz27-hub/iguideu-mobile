import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiGet, apiPost } from "../../config/api";

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

export default function ReservasScreen() {
  const params = useLocalSearchParams<{ guideId?: string; guideLocked?: string }>();
  const lockedGuideId = typeof params.guideId === "string" ? params.guideId : "";
  const guideLocked = params.guideLocked === "1";

  const [travelerEmail, setTravelerEmail] = useState("test+frontend@iguideu.com");
  const [date, setDate] = useState(todayString());
  const [hours, setHours] = useState("1");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState(lockedGuideId);
  const [loading, setLoading] = useState(false);

  async function loadGuides() {
    const data = await apiGet<any>("/api/guides");
    const list = Array.isArray(data) ? data : [];
    setGuides(list);

    if (guideLocked && lockedGuideId) {
      setSelectedGuideId(lockedGuideId);
      return;
    }

    if (!selectedGuideId && list.length > 0) {
      setSelectedGuideId(list[0]._id);
    }
  }

  async function loadBookings() {
    const data = await apiGet<any>("/api/bookings");
    const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    setBookings(list);
  }

  async function refreshAll() {
    try {
      setLoading(true);
      await Promise.all([loadGuides(), loadBookings()]);
    } catch (error: any) {
      console.log("ERROR refresh reservas", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (guideLocked && lockedGuideId) {
      setSelectedGuideId(lockedGuideId);
    }
  }, [guideLocked, lockedGuideId]);

  const selectedGuide = useMemo(() => {
    return guides.find((g) => g._id === selectedGuideId) || null;
  }, [guides, selectedGuideId]);

  const selectedPriceHour = useMemo(() => {
    return selectedGuide?.priceHour ?? selectedGuide?.pricePerHour ?? 0;
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
    try {
      const h = Number(hours);

      if (!travelerEmail.trim()) {
        Alert.alert("Error", "Ingresá email.");
        return;
      }

      if (!date.trim()) {
        Alert.alert("Error", "Ingresá fecha.");
        return;
      }

      if (!selectedGuideId) {
        Alert.alert("Error", "Seleccioná un guía.");
        return;
      }

      if (!Number.isFinite(h) || h <= 0) {
        Alert.alert("Error", "Ingresá horas válidas.");
        return;
      }

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        Alert.alert("Error", "Monto inválido.");
        return;
      }

      if (!Number.isFinite(totalAmountCents) || totalAmountCents <= 0) {
        Alert.alert("Error", "Monto en centavos inválido.");
        return;
      }

      const payload = {
        travelerEmail: travelerEmail.trim(),
        date: date.trim(),
        hours: h,
        guideId: selectedGuideId,
      };

      const created = await apiPost<any>("/api/bookings", payload);
      const bookingId = created?._id || created?.booking?._id || created?.id;

      Alert.alert("OK", "Reserva creada");

      await loadBookings();

      if (bookingId) {
        await apiPost("/api/payments/pay-test", {
          bookingId,
          amount: totalAmount,
          amountUsd: totalAmount,
          amountCents: totalAmountCents,
        });

        Alert.alert("OK", "Reserva marcada como PAID en test");

        await loadBookings();
      }
    } catch (error: any) {
      console.log("ERROR createBooking()", error);
      Alert.alert("Error", error?.message || "No se pudo crear la reserva.");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Reservas</Text>

      <Text style={{ fontSize: 16 }}>Traveler Email</Text>
      <TextInput
        value={travelerEmail}
        onChangeText={setTravelerEmail}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#000000",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 18,
          fontSize: 16,
          backgroundColor: "#ffffff",
        }}
      />

      <Text style={{ fontSize: 16 }}>Fecha</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        style={{
          borderWidth: 1,
          borderColor: "#000000",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 18,
          fontSize: 16,
          backgroundColor: "#ffffff",
        }}
      />

      <Text style={{ fontSize: 16 }}>Guía</Text>

      {guideLocked && selectedGuide ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#000000",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 18,
            backgroundColor: "#000000",
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
            {selectedGuide.name} — {[selectedGuide.city, selectedGuide.country].filter(Boolean).join(", ")}
          </Text>
          <Text style={{ color: "#d1d5db", marginTop: 8, fontSize: 16 }}>
            Guía seleccionada desde el perfil
          </Text>
        </View>
      ) : null}

      {!guideLocked &&
        guides.map((guide) => {
          const active = guide._id === selectedGuideId;
          return (
            <Pressable
              key={guide._id}
              onPress={() => setSelectedGuideId(guide._id)}
              style={{
                borderWidth: 1,
                borderColor: "#000000",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 18,
                backgroundColor: active ? "#000000" : "#ffffff",
              }}
            >
              <Text style={{ color: active ? "#ffffff" : "#000000", fontSize: 18, fontWeight: "700" }}>
                {guide.name} — {[guide.city, guide.country].filter(Boolean).join(", ")}
              </Text>
            </Pressable>
          );
        })}

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
          backgroundColor: "#ffffff",
        }}
      />

      <View
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 16,
          padding: 16,
          backgroundColor: "#ffffff",
          gap: 6,
        }}
      >
        <Text style={{ fontWeight: "700", fontSize: 18 }}>Resumen</Text>
        <Text>Guía: {selectedGuide?.name || "-"}</Text>
        <Text>Fecha: {date}</Text>
        <Text>Horas: {hours}</Text>
        <Text>Precio/hora: USD {selectedPriceHour || 0}</Text>
        <Text>Total: USD {totalAmount.toFixed(2)}</Text>
        <Text>Total centavos: {totalAmountCents}</Text>
      </View>

      <Pressable
        onPress={createBooking}
        style={{
          backgroundColor: "#000000",
          paddingVertical: 18,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
          {loading ? "Cargando..." : "PAGAR AHORA"}
        </Text>
      </Pressable>

      <Text style={{ fontSize: 16, textAlign: "center", color: "#4b5563" }}>
        Tu información de contacto se compartirá solo después del pago
      </Text>

      <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 12 }}>Mis reservas</Text>

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
              borderColor: "#000000",
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#ffffff",
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>{booking.guideName || "Guía"}</Text>
            <Text>Email: {booking.travelerEmail || booking.email || "-"}</Text>
            <Text>Fecha: {booking.date || "-"}</Text>
            <Text>Horas: {booking.hours ?? "-"}</Text>
            <Text>Monto: USD {Number(amount).toFixed(2)}</Text>
            <Text>Estado: {booking.status || "-"}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}