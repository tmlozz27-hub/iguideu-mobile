import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
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
  const params = useLocalSearchParams<{ guideId?: string }>();
  const lockedGuideId = typeof params.guideId === "string" ? params.guideId : "";

  const [travelerEmail, setTravelerEmail] = useState("test+frontend@iguideu.com");
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
    const data = await apiGet("/api/bookings");
    const list = Array.isArray(data) ? data : Array.isArray((data as any)?.items) ? (data as any).items : [];
    const paidOnly = list.filter((item: Booking) => String(item.status || "").toUpperCase() === "PAID");
    setBookings(paidOnly);
  }

  async function refreshAll() {
    try {
      setLoading(true);
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
        Alert.alert("Error", "Primero elegí un guía.");
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
        guideId: selectedGuideId
      };

      const created = await apiPost("/api/bookings", payload);
      const bookingId =
        (created as any)?._id ||
        (created as any)?.booking?._id ||
        (created as any)?.id;

      if (!bookingId) {
        Alert.alert("Error", "La reserva se creó pero no volvió el bookingId.");
        await loadBookings();
        return;
      }

      await apiPost("/api/payments/pay-test", {
        bookingId,
        amount: totalAmount,
        amountUsd: totalAmount,
        amountCents: totalAmountCents
      });

      Alert.alert("OK", "Reserva creada y marcada como PAID en test");
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
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#ffffff",
              gap: 6
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

          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#ffffff",
              gap: 8
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Antes de confirmar tu reserva
            </Text>

            <Text>• La tarifa corresponde únicamente al servicio del guía según la modalidad indicada</Text>
            <Text>• Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente</Text>
            <Text>• En actividades compartidas, el viajero cubre también los gastos del guía</Text>
            <Text>• Podés cancelar sin costo con más de 24 horas de anticipación</Text>
            <Text>• Si surge un imprevisto, podés coordinar directamente con tu guía un cambio de horario o fecha</Text>
            <Text>• Las horas adicionales se acuerdan con el guía y se cobran según la tarifa publicada</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#f9fafb",
              gap: 8
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Confirmación
            </Text>

            <Text>• Confirmo que revisé la tarifa, duración y condiciones de esta reserva</Text>
            <Text>• Confirmo que los gastos adicionales no están incluidos salvo que se indique expresamente</Text>
            <Text>• Confirmo que leí las condiciones de cancelación, cambios e imprevistos</Text>

            <Text style={{ marginTop: 6, fontSize: 14, color: "#4b5563" }}>
              Pago seguro · Reserva registrada · Mayor transparencia para ambas partes
            </Text>
          </View>

          <Pressable
            onPress={createBooking}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#6b7280" : "#000000",
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
              {loading ? "Cargando..." : "PAGAR AHORA"}
            </Text>
          </Pressable>

          <Text style={{ fontSize: 16, textAlign: "center", color: "#4b5563" }}>
            Tu información de contacto se compartirá solo después del pago
          </Text>
        </>
      ) : null}

      <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 12 }}>Mis reservas</Text>

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
          <Text style={{ fontSize: 16, color: "#4b5563" }}>Todavía no hay reservas pagadas.</Text>
        </View>
      ) : null}

      {bookings.map((booking) => {
        const amount = booking.amount ?? booking.amountUsd ?? booking.totalAmount ?? 0;

        return (
          <View
            key={booking._id}
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#ffffff",
              gap: 4
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>{booking.guideName || "Guía"}</Text>
            <Text>Email: {booking.travelerEmail || booking.email || "-"}</Text>
            <Text>Fecha: {booking.date || "-"}</Text>
            <Text>Horas: {booking.hours ?? "-"}</Text>
            <Text>Monto: USD {Number(amount || 0).toFixed(2)}</Text>
            <Text>Estado: {booking.status || "-"}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}