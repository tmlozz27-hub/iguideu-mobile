import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { createBooking, createPaymentIntent, getGuides } from "../../config/api";

const PK = String(process.env.EXPO_PUBLIC_STRIPE_PK || "").trim();

function Btn({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        marginTop: 14,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: disabled ? "#bdbdbd" : "#111"
      }}
    >
      <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );
}

function InnerReservas() {
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  const [loadingGuides, setLoadingGuides] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);
  const [travelerEmail, setTravelerEmail] = useState("test+frontend@iguideu.com");
  const [guideId, setGuideId] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [hours, setHours] = useState("2");

  const [busy, setBusy] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoadingGuides(true);
        const list = await getGuides();
        const arr = Array.isArray(list) ? list : list?.guides || [];
        setGuides(arr);
        if (!guideId && arr?.[0]?._id) setGuideId(arr[0]._id);
      } catch (e: any) {
        Alert.alert("Error", e?.message || String(e));
      } finally {
        setLoadingGuides(false);
      }
    })();
  }, []);

  const canPay = useMemo(() => {
    const h = Number(hours || 0);
    return !!travelerEmail.trim() && !!guideId.trim() && !!date.trim() && h > 0;
  }, [travelerEmail, guideId, date, hours]);

  async function doPay() {
    try {
      setBusy(true);

      const h = parseInt(hours || "0", 10);
      if (!travelerEmail.trim()) return Alert.alert("Falta email");
      if (!guideId.trim()) return Alert.alert("Falta guideId");
      if (!date.trim()) return Alert.alert("Falta fecha");
      if (!h || h <= 0) return Alert.alert("Horas inválidas");

      const bookingRes = await createBooking({
        travelerEmail: travelerEmail.trim(),
        guideId: guideId.trim(),
        date: date.trim(),
        hours: h
      });

      const bid =
        bookingRes?._id ||
        bookingRes?.booking?._id ||
        bookingRes?.bookingId ||
        bookingRes?.id;

      if (!bid) throw new Error("BOOKING_ID_MISSING");

      setBookingId(String(bid));

      const intent = await createPaymentIntent({ bookingId: String(bid) });

      const cs =
        intent?.stripeClientSecret ||
        intent?.clientSecret ||
        intent?.paymentIntent;

      if (!cs) throw new Error("CLIENT_SECRET_MISSING");

      setClientSecret(cs);
      setPaymentIntentId(intent?.stripePaymentIntentId || intent?.paymentIntentId || "");

      const initRes = await initPaymentSheet({
        paymentIntentClientSecret: cs,
        merchantDisplayName: "I GUIDE U"
      });

      if (initRes.error) return Alert.alert("Error initPaymentSheet", initRes.error.message);

      const payRes = await presentPaymentSheet();
      if (payRes.error) return Alert.alert("Pago cancelado", payRes.error.message);

      Alert.alert("PAGO OK", "PaymentSheet completado. Mirá SERVER/STRIPE para webhook.");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 14 }}>Reservas</Text>

      <Text style={{ fontSize: 14, marginBottom: 6 }}>Traveler Email</Text>
      <TextInput
        value={travelerEmail}
        onChangeText={setTravelerEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 12, fontSize: 16 }}
      />

      <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 6 }}>Guía</Text>
      {loadingGuides ? (
        <View style={{ paddingVertical: 10 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={{ borderWidth: 1, borderColor: "#999", borderRadius: 10, overflow: "hidden" }}>
          {guides.map((g) => (
            <Pressable
              key={g._id}
              onPress={() => setGuideId(g._id)}
              style={{
                padding: 12,
                backgroundColor: guideId === g._id ? "#e9e9e9" : "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#eee"
              }}
            >
              <Text style={{ fontWeight: "800" }}>{g.name || g._id}</Text>
              <Text style={{ color: "#444" }}>
                {g.city || ""} {g.country ? `• ${g.country}` : ""}
              </Text>
              <Text style={{ color: "#666" }}>guideId: {g._id}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 6 }}>Fecha (yyyy-mm-dd)</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 12, fontSize: 16 }}
      />

      <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 6 }}>Horas</Text>
      <TextInput
        value={hours}
        onChangeText={setHours}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 12, fontSize: 16 }}
      />

      <Btn title={busy ? "PROCESANDO..." : "PAGAR (PAYMENTSHEET)"} onPress={doPay} disabled={!canPay || busy} />

      <View style={{ marginTop: 18, padding: 12, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10 }}>
        <Text style={{ fontWeight: "800", marginBottom: 8 }}>Resultado</Text>
        <Text style={{ color: "#333" }}>bookingId: {bookingId || "—"}</Text>
        <Text style={{ color: "#333", marginTop: 6 }}>paymentIntentId: {paymentIntentId || "—"}</Text>
        <Text style={{ color: "#333", marginTop: 6 }}>
          clientSecret: {clientSecret ? `${clientSecret.slice(0, 18)}…` : "—"}
        </Text>
      </View>

      <Text style={{ marginTop: 12, color: "#666" }}>stripe pk loaded: {PK ? "YES" : "NO"}</Text>
    </ScrollView>
  );
}

export default function ReservasScreen() {
  if (!PK) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Falta EXPO_PUBLIC_STRIPE_PK</Text>
        <Text style={{ marginTop: 8, color: "#666", textAlign: "center" }}>
          Poné EXPO_PUBLIC_STRIPE_PK en .env y reiniciá Metro con --clear
        </Text>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={PK}>
      <InnerReservas />
    </StripeProvider>
  );
}
