import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet, apiPost } from "../../config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

type Guide = {
  _id?: string;
  id?: string;
  name?: string;
  country?: string;
  city?: string;
  pricePerHour?: number;
  priceHour?: number;
  priceDay?: number;
  price24h?: number;
  priceFullDay24h?: number;
};

type Mode = "hour" | "day8" | "day24";

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("No hay sesión activa");
  return { Authorization: `Bearer ${token}` };
}

async function getStoredTravelerEmail() {
  return String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "")
    .trim()
    .toLowerCase();
}

function todayYmd() {
  return new Date().toISOString().slice(0, 10);
}

export default function ReservasScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const params = useLocalSearchParams<any>();

  const routeGuideId = useMemo(() => {
    const raw = params.guideId || params.id || params._id || params.guide || "";
    return String(Array.isArray(raw) ? raw[0] : raw).trim();
  }, [params]);

  const [travelerEmail, setTravelerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<Guide | null>(null);

  const [date, setDate] = useState(todayYmd());
  const [mode, setMode] = useState<Mode>("hour");
  const [hours, setHours] = useState("1");

  useEffect(() => {
    (async () => {
      try {
        const email = await getStoredTravelerEmail();
        setTravelerEmail(email);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!routeGuideId) return;

        const data = await apiGet("/api/guides");
        const list = data?.items || data?.guides || data?.data || data || [];
        const guidesArray = Array.isArray(list) ? list : [];

        const found =
          guidesArray.find((g: any) => g._id === routeGuideId) ||
          guidesArray.find((g: any) => g.id === routeGuideId) ||
          null;

        setGuide(found);
      } catch (e) {
        console.log("RESERVAS_LOAD_GUIDE_ERROR", e);
      }
    })();
  }, [routeGuideId]);

  const pricePerHour = Number(guide?.priceHour ?? guide?.pricePerHour ?? 0);
  const priceDay8 = Number(guide?.priceDay ?? 0);
  const price24 = Number(guide?.price24h ?? guide?.priceFullDay24h ?? 0);

  const hoursNumber = Number(hours);

  const effectiveHours =
    mode === "hour"
      ? Number.isFinite(hoursNumber) && hoursNumber > 0
        ? hoursNumber
        : 0
      : mode === "day8"
      ? 8
      : 24;

  const totalAmount =
    mode === "hour"
      ? Number((pricePerHour * effectiveHours).toFixed(2))
      : mode === "day8"
      ? priceDay8
      : price24;

  async function createBooking() {
    try {
      setLoading(true);

      const headers = await getAuthHeaders();
      const emailClean = await getStoredTravelerEmail();

      if (!routeGuideId) throw new Error("Falta guideId");
      if (!emailClean) throw new Error("Falta email");
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Fecha inválida");
      if (!guide) throw new Error("No se encontró el guía");

      if (mode === "hour") {
        if (!Number.isFinite(hoursNumber) || hoursNumber <= 0) {
          throw new Error("Ingresá una cantidad de horas válida");
        }
        if (pricePerHour <= 0) {
          throw new Error("El guía no tiene tarifa por hora");
        }
      }

      if (mode === "day8" && priceDay8 <= 0) {
        throw new Error("El guía no tiene tarifa de jornada");
      }

      if (mode === "day24" && price24 <= 0) {
        throw new Error("El guía no tiene tarifa de 24 horas");
      }

      const bookingPayload = {
        guideId: routeGuideId,
        travelerEmail: emailClean,
        date,
        hours: effectiveHours,
        amount: totalAmount,
        totalAmount,
        amountCents: Math.round(totalAmount * 100),
      };

      console.log("BOOKING_PAYLOAD", bookingPayload);

      const bookingResponse = await apiPost("/api/bookings", bookingPayload, headers);

      console.log("BOOKING_RESPONSE", bookingResponse);

      const bookingId =
        bookingResponse?._id ||
        bookingResponse?.id ||
        bookingResponse?.booking?._id ||
        bookingResponse?.booking?.id ||
        bookingResponse?.item?._id ||
        bookingResponse?.item?.id;

      if (!bookingId) throw new Error("No se creó la reserva");

      const paymentResponse = await apiPost(
        "/api/payments/create-intent",
        { bookingId },
        headers
      );

      console.log("PAYMENT_RESPONSE", paymentResponse);

      const clientSecret = paymentResponse?.clientSecret;
      if (!clientSecret) throw new Error("No se pudo iniciar el pago");

      const init = await initPaymentSheet({
        merchantDisplayName: "I GUIDE U",
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: { email: emailClean },
      });

      if (init.error) {
        throw new Error(init.error.message);
      }

      const result = await presentPaymentSheet();

      if (result.error) {
        Alert.alert("Pago no completado", result.error.message);
        return;
      }

      console.log("GO TO CHAT WITH BOOKING", bookingId);

      Alert.alert("OK", "Pago realizado correctamente", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/chat",
              params: { bookingId },
            }),
        },
      ]);
    } catch (e: any) {
      console.log("RESERVAS_ERROR", e);
      Alert.alert("Error", e?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  function ModeButton({
    value,
    label,
    active,
    onPress,
  }: {
    value: Mode;
    label: string;
    active: boolean;
    onPress: (value: Mode) => void;
  }) {
    return (
      <Pressable
        onPress={() => onPress(value)}
        style={{
          flex: 1,
          backgroundColor: active ? "#27D3BE" : "#3A6EA5",
          borderWidth: 1,
          borderColor: active ? "#27D3BE" : "#5E89B7",
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "800",
            fontSize: 15,
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#15539A" }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
    >
      <View
        style={{
          backgroundColor: "#2F5F93",
          borderRadius: 24,
          padding: 18,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "800" }}>
          Reserva
        </Text>

        <Text style={{ color: "#FFFFFF", marginTop: 14, fontSize: 20, fontWeight: "700" }}>
          {guide?.name || "Guía"}
        </Text>

        <Text style={{ color: "#DCEBFF", marginTop: 6, fontSize: 16 }}>
          {[guide?.city, guide?.country].filter(Boolean).join(", ") || "-"}
        </Text>

        <View
          style={{
            marginTop: 18,
            backgroundColor: "#376AA0",
            borderRadius: 20,
            padding: 16,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
            Elegí modalidad
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <ModeButton
              value="hour"
              label="Por hora"
              active={mode === "hour"}
              onPress={setMode}
            />
            <ModeButton
              value="day8"
              label="Jornada 8h"
              active={mode === "day8"}
              onPress={setMode}
            />
            <ModeButton
              value="day24"
              label="24 hs"
              active={mode === "day24"}
              onPress={setMode}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 18,
            backgroundColor: "#376AA0",
            borderRadius: 20,
            padding: 16,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
            Fecha
          </Text>

          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#BFD5F1"
            style={{
              marginTop: 10,
              backgroundColor: "#2B5D93",
              borderWidth: 1,
              borderColor: "#5E89B7",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 14,
              color: "#FFFFFF",
              fontSize: 16,
            }}
          />
        </View>

        {mode === "hour" ? (
          <View
            style={{
              marginTop: 18,
              backgroundColor: "#376AA0",
              borderRadius: 20,
              padding: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
              Cantidad de horas
            </Text>

            <TextInput
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
              placeholder="Ej: 1, 2, 5, 15"
              placeholderTextColor="#BFD5F1"
              style={{
                marginTop: 10,
                backgroundColor: "#2B5D93",
                borderWidth: 1,
                borderColor: "#5E89B7",
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 14,
                color: "#FFFFFF",
                fontSize: 16,
              }}
            />

            <Text style={{ color: "#DCEBFF", marginTop: 10, fontSize: 14 }}>
              Podés elegir la cantidad de horas que quieras.
            </Text>
          </View>
        ) : null}

        <View
          style={{
            marginTop: 18,
            backgroundColor: "#376AA0",
            borderRadius: 20,
            padding: 16,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
            Tarifas
          </Text>

          <Text style={{ color: "#FFFFFF", marginTop: 12, fontSize: 15 }}>
            Por hora: USD {pricePerHour > 0 ? pricePerHour : "-"}
          </Text>

          <Text style={{ color: "#FFFFFF", marginTop: 10, fontSize: 15 }}>
            Jornada de 8h: USD {priceDay8 > 0 ? priceDay8 : "-"}
          </Text>

          <Text style={{ color: "#FFFFFF", marginTop: 10, fontSize: 15 }}>
            24 horas: USD {price24 > 0 ? price24 : "-"}
          </Text>
        </View>

        <View
          style={{
            marginTop: 18,
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor: "#6F94BC",
            backgroundColor: "#2F5F93",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}>
            Antes de reservar
          </Text>

          <Text style={{ color: "#E4F0FF", marginTop: 14, lineHeight: 30, fontSize: 15 }}>
            • Cada guía ofrece una experiencia personalizada según tus intereses{"\n"}
            • Podés coordinar directamente los detalles para adaptar el recorrido{"\n"}
            • Las tarifas corresponden al servicio del guía según la modalidad indicada{"\n"}
            • Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente{"\n"}
            • En actividades compartidas, el viajero cubre también los gastos del guía{"\n"}
            • Reservando a través de la plataforma asegurás una experiencia clara, segura y registrada
          </Text>
        </View>

        <View
          style={{
            marginTop: 18,
            backgroundColor: "#376AA0",
            borderRadius: 20,
            padding: 16,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
            Resumen
          </Text>

          <Text style={{ color: "#FFFFFF", marginTop: 12, fontSize: 15 }}>
            Email: {travelerEmail || "-"}
          </Text>

          <Text style={{ color: "#FFFFFF", marginTop: 10, fontSize: 15 }}>
            Modalidad: {mode === "hour" ? "Por hora" : mode === "day8" ? "Jornada 8h" : "24 hs"}
          </Text>

          <Text style={{ color: "#FFFFFF", marginTop: 10, fontSize: 15 }}>
            Horas: {effectiveHours || "-"}
          </Text>

          <Text style={{ color: "#FFFFFF", marginTop: 10, fontSize: 15, fontWeight: "800" }}>
            Total: USD {totalAmount > 0 ? totalAmount : "-"}
          </Text>
        </View>

        <Pressable
          onPress={createBooking}
          disabled={loading}
          style={{
            marginTop: 22,
            backgroundColor: "#27D3BE",
            paddingVertical: 20,
            borderRadius: 22,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>
            {loading ? "PROCESANDO..." : "Pagar"}
          </Text>
        </Pressable>

        <Text
          style={{
            color: "#E4F0FF",
            textAlign: "center",
            marginTop: 18,
            fontSize: 15,
          }}
        >
          El chat con el guía se habilita únicamente después del pago.
        </Text>
      </View>
    </ScrollView>
  );
}