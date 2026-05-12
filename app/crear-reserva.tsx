import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import { apiGet, apiPost } from "../config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";
const LANG_KEY = "iguideu_lang";

type Lang = "es" | "en";

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

const copy = {
  es: {
    title: "Reservas",
    noGuideTitle: "Todavía no elegiste un guía",
    noGuideText: "Primero elegí un guía desde Buscar guías por país o Guías cercanos.",
    searchGuides: "IR A BUSCAR GUÍAS",
    travelerEmail: "Email del viajero",
    date: "Fecha",
    today: "Hoy",
    tomorrow: "Mañana",
    plusTwoDays: "+2 días",
    selectedDate: "Fecha seleccionada",
    pickAnotherDate: "TOCAR PARA ELEGIR OTRA FECHA",
    confirmDate: "CONFIRMAR FECHA",
    guide: "Guía",
    selectedGuide: "Guía seleccionada desde el perfil",
    hours: "Horas",
    adults: "Adultos (18+)",
    youth: "Jóvenes (13 a 17)",
    children: "Niños (0 a 12)",
    summary: "Resumen",
    totalTravelers: "Total viajeros",
    adultPriceHour: "Precio adulto/hora",
    youthPriceHour: "Precio joven/hora",
    childrenFree: "Niños (0 a 12): sin cargo",
    total: "Total",
    beforeBooking: "Antes de confirmar tu reserva",
    rule1: "El servicio corresponde a la modalidad indicada y se calcula por viajero según edad",
    rule2: "Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente",
    rule3: "Podés coordinar directamente con tu guía los gastos o detalles adicionales",
    rule4: "Podés cancelar sin costo con más de 24 horas de anticipación",
    rule5: "Si surge un imprevisto, podés coordinar directamente con tu guía un cambio de horario o fecha",
    rule6: "Las horas adicionales se acuerdan con el guía y se cobran según la tarifa publicada",
    confirmation: "Confirmación",
    confirm1: "Confirmo que revisé la tarifa, duración y condiciones de esta reserva",
    confirm2: "Confirmo que los gastos adicionales no están incluidos salvo que se indique expresamente",
    confirm3: "Confirmo que leí las condiciones de cancelación, cambios e imprevistos",
    securePayment: "Pago seguro · Reserva registrada · Mayor transparencia para ambas partes",
    loading: "Cargando...",
    payNow: "PAGAR AHORA",
    openChat: "ABRIR CHAT",
    contactAfterPayment: "Tu información de contacto se compartirá solo después del pago",
    myBookings: "Mis reservas",
    noPaidBookings: "Todavía no hay reservas pagadas.",
    email: "Email",
    amount: "Monto",
    status: "Estado",
    error: "Error",
    noSession: "No hay sesión activa. Volvé a iniciar sesión.",
    missingEmail: "Falta el email del viajero.",
    enterDate: "Ingresá fecha.",
    chooseGuide: "Primero elegí un guía.",
    validHours: "Ingresá horas válidas.",
    enterTraveler: "Ingresá al menos 1 viajero.",
    bookingNoId: "La reserva se creó pero no volvió el bookingId.",
    paymentStartError: "No se pudo iniciar el pago.",
    paymentPrepareError: "No se pudo preparar el pago.",
    paymentIncomplete: "Pago no completado",
    paymentCancelled: "El pago fue cancelado.",
    ok: "OK",
    paymentSuccess: "Pago realizado correctamente.",
    createBookingError: "No se pudo crear la reserva.",
    loadBookingsError: "No se pudieron cargar las reservas."
  },
  en: {
    title: "Bookings",
    noGuideTitle: "You have not selected a guide yet",
    noGuideText: "First choose a guide from Guides by country or Nearby guides.",
    searchGuides: "SEARCH GUIDES",
    travelerEmail: "Traveler email",
    date: "Date",
    today: "Today",
    tomorrow: "Tomorrow",
    plusTwoDays: "+2 days",
    selectedDate: "Selected date",
    pickAnotherDate: "TAP TO CHOOSE ANOTHER DATE",
    confirmDate: "CONFIRM DATE",
    guide: "Guide",
    selectedGuide: "Guide selected from profile",
    hours: "Hours",
    adults: "Adults (18+)",
    youth: "Young travelers (13 to 17)",
    children: "Children (0 to 12)",
    summary: "Summary",
    totalTravelers: "Total travelers",
    adultPriceHour: "Adult price/hour",
    youthPriceHour: "Young traveler price/hour",
    childrenFree: "Children (0 to 12): free",
    total: "Total",
    beforeBooking: "Before booking",
    rule1: "The service corresponds to the selected option and is calculated per traveler by age",
    rule2: "Expenses such as meals, transportation, or tickets are not included unless clearly stated",
    rule3: "You can coordinate additional expenses or details directly with your guide",
    rule4: "You can cancel for free more than 24 hours in advance",
    rule5: "If something unexpected happens, you can coordinate a time or date change directly with your guide",
    rule6: "Additional hours are agreed with the guide and charged according to the published rate",
    confirmation: "Confirmation",
    confirm1: "I confirm that I reviewed the rate, duration, and conditions of this booking",
    confirm2: "I confirm that additional expenses are not included unless clearly stated",
    confirm3: "I confirm that I read the cancellation, change, and unexpected event conditions",
    securePayment: "Secure payment · Registered booking · More transparency for both parties",
    loading: "Loading...",
    payNow: "PAY NOW",
    openChat: "OPEN CHAT",
    contactAfterPayment: "Your contact information will be shared only after payment",
    myBookings: "My bookings",
    noPaidBookings: "There are no paid bookings yet.",
    email: "Email",
    amount: "Amount",
    status: "Status",
    error: "Error",
    noSession: "There is no active session. Please sign in again.",
    missingEmail: "Traveler email is missing.",
    enterDate: "Enter a date.",
    chooseGuide: "First choose a guide.",
    validHours: "Enter valid hours.",
    enterTraveler: "Enter at least 1 traveler.",
    bookingNoId: "The booking was created but no bookingId was returned.",
    paymentStartError: "Could not start payment.",
    paymentPrepareError: "Could not prepare payment.",
    paymentIncomplete: "Payment not completed",
    paymentCancelled: "The payment was cancelled.",
    ok: "OK",
    paymentSuccess: "Payment completed successfully.",
    createBookingError: "Could not create the booking.",
    loadBookingsError: "Could not load bookings."
  }
};

function formatDateToString(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function todayString() {
  return formatDateToString(new Date());
}

function addDaysString(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDateToString(d);
}

function parseDateString(value?: string) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return now;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day, 12, 0, 0, 0);

  if (Number.isNaN(parsed.getTime())) {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return now;
  }

  return parsed;
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

export default function CrearReservaScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const params = useLocalSearchParams<{ guideId?: string }>();
  const lockedGuideId = typeof params.guideId === "string" ? params.guideId : "";

  const [lang, setLang] = useState<Lang>("es");
  const t = copy[lang];

  const [travelerEmail, setTravelerEmail] = useState("");
  const [date, setDate] = useState(todayString());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(parseDateString(todayString()));
  const [hours, setHours] = useState("1");
  const [adults, setAdults] = useState("1");
  const [youth, setYouth] = useState("0");
  const [children, setChildren] = useState("0");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState(lockedGuideId);
  const [loading, setLoading] = useState(false);
  const [lastPaidBookingId, setLastPaidBookingId] = useState("");

  const loadLang = useCallback(async () => {
    const savedLang = String((await AsyncStorage.getItem(LANG_KEY)) || "").trim().toLowerCase();

    if (savedLang === "en" || savedLang.startsWith("en")) {
      setLang("en");
      return;
    }

    setLang("es");
  }, []);

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

      await loadLang();

      const savedEmail = String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "").trim().toLowerCase();
      if (savedEmail) {
        setTravelerEmail(savedEmail);
      }

      await loadGuides();
      await loadBookings();
    } catch (error: any) {
      console.log("ERROR refresh reservas", error);
      Alert.alert(t.error, error?.message || t.loadBookingsError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLang();
    }, [loadLang])
  );

  useEffect(() => {
    if (lockedGuideId) {
      setSelectedGuideId(lockedGuideId);
    }
  }, [lockedGuideId]);

  useEffect(() => {
    setPickerDate(parseDateString(date));
  }, [date]);

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

  function openDatePicker() {
    setPickerDate(parseDateString(date));
    setShowDatePicker(true);
  }

  function onChangeDate(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event.type === "dismissed") {
      return;
    }

    if (selected) {
      const normalized = new Date(selected);
      normalized.setHours(12, 0, 0, 0);
      setPickerDate(normalized);
      setDate(formatDateToString(normalized));
    }
  }

  async function createBooking() {
    if (loading) return;

    try {
      setLoading(true);
      setLastPaidBookingId("");

      const headers = await getAuthHeaders();
      const h = Number(hours);
      const emailClean = String(travelerEmail || "").trim().toLowerCase();

      if (!headers) {
        Alert.alert(t.error, t.noSession);
        return;
      }

      if (!emailClean) {
        Alert.alert(t.error, t.missingEmail);
        return;
      }

      if (!date.trim()) {
        Alert.alert(t.error, t.enterDate);
        return;
      }

      if (!selectedGuideId) {
        Alert.alert(t.error, t.chooseGuide);
        return;
      }

      if (!Number.isFinite(h) || h <= 0) {
        Alert.alert(t.error, t.validHours);
        return;
      }

      if (travelersCount <= 0) {
        Alert.alert(t.error, t.enterTraveler);
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
        Alert.alert(t.error, t.bookingNoId);
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
        Alert.alert(t.error, t.paymentStartError);
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
        Alert.alert(t.error, init.error.message || t.paymentPrepareError);
        return;
      }

      const result = await presentPaymentSheet();

      if (result.error) {
        Alert.alert(t.paymentIncomplete, result.error.message || t.paymentCancelled);
        return;
      }

      setLastPaidBookingId(String(bookingId));
      Alert.alert(t.ok, t.paymentSuccess);
      await loadBookings();
    } catch (error: any) {
      console.log("ERROR createBooking()", error);
      Alert.alert(t.error, error?.message || t.createBookingError);
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
          {t.title}
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
              {t.noGuideTitle}
            </Text>
            <Text style={{ fontSize: 16, color: "#173B6B", lineHeight: 24 }}>
              {t.noGuideText}
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
                {t.searchGuides}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {showReservationForm ? (
          <>
            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>{t.travelerEmail}</Text>
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

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>{t.date}</Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              {[
                { label: t.today, value: todayString() },
                { label: t.tomorrow, value: addDaysString(1) },
                { label: t.plusTwoDays, value: addDaysString(2) }
              ].map((opt) => (
                <Pressable
                  key={opt.label}
                  onPress={() => setDate(opt.value)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 14,
                    backgroundColor: date === opt.value ? "#1cc9b7" : "rgba(255,255,255,0.6)"
                  }}
                >
                  <Text
                    style={{
                      color: date === opt.value ? "#ffffff" : "#173B6B",
                      fontWeight: "700"
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={openDatePicker}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 18,
                backgroundColor: "rgba(255,255,255,0.96)"
              }}
            >
              <Text style={{ fontSize: 16, color: "#111827" }}>
                {t.selectedDate}: {date}
              </Text>
              <Text style={{ marginTop: 8, fontSize: 14, fontWeight: "700", color: "#15539A" }}>
                {t.pickAnotherDate}
              </Text>
            </Pressable>

            {showDatePicker ? (
              <View
                style={{
                  marginTop: 8,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.16)",
                  borderRadius: 18,
                  padding: 8,
                  backgroundColor: "rgba(255,255,255,0.96)"
                }}
              >
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date()}
                  onChange={onChangeDate}
                />

                {Platform.OS === "ios" ? (
                  <Pressable
                    onPress={() => setShowDatePicker(false)}
                    style={{
                      marginTop: 8,
                      backgroundColor: "#1cc9b7",
                      paddingVertical: 14,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "800" }}>
                      {t.confirmDate}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>{t.guide}</Text>

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
                {t.selectedGuide}
              </Text>
            </View>

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>{t.hours}</Text>
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

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>{t.adults}</Text>
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

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>{t.youth}</Text>
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

            <Text style={{ fontSize: 16, color: "#15539A", fontWeight: "700" }}>{t.children}</Text>
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
              <Text style={{ fontWeight: "800", fontSize: 18, color: "#15539A" }}>{t.summary}</Text>
              <Text style={{ color: "#173B6B" }}>{t.guide}: {selectedGuide?.name || "-"}</Text>
              <Text style={{ color: "#173B6B" }}>{t.date}: {date}</Text>
              <Text style={{ color: "#173B6B" }}>{t.hours}: {hours}</Text>
              <Text style={{ color: "#173B6B" }}>{t.adults}: {adultsCount}</Text>
              <Text style={{ color: "#173B6B" }}>{t.youth}: {youthCount}</Text>
              <Text style={{ color: "#173B6B" }}>{t.children}: {childrenCount}</Text>
              <Text style={{ color: "#173B6B" }}>{t.totalTravelers}: {travelersCount}</Text>
              <Text style={{ color: "#173B6B" }}>{t.adultPriceHour}: USD {selectedPriceHour || 0}</Text>
              <Text style={{ color: "#173B6B" }}>{t.youthPriceHour}: USD {youthPriceHour.toFixed(2)}</Text>
              <Text style={{ color: "#173B6B" }}>{t.childrenFree}</Text>
              <Text style={{ color: "#15539A", fontWeight: "800", marginTop: 4 }}>
                {t.total}: USD {totalAmount.toFixed(2)}
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
                {t.beforeBooking}
              </Text>

              {[t.rule1, t.rule2, t.rule3, t.rule4, t.rule5, t.rule6].map((item) => (
                <Text key={item} style={{ color: "#173B6B", lineHeight: 23 }}>
                  {"\u2022"} {item}
                </Text>
              ))}
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
                {t.confirmation}
              </Text>

              {[t.confirm1, t.confirm2, t.confirm3].map((item) => (
                <Text key={item} style={{ color: "#173B6B", lineHeight: 23 }}>
                  {"\u2022"} {item}
                </Text>
              ))}

              <Text style={{ marginTop: 6, fontSize: 14, color: "#173B6B" }}>
                {t.securePayment}
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
                {loading ? t.loading : t.payNow}
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
                  {t.openChat}
                </Text>
              </Pressable>
            ) : null}

            <Text style={{ fontSize: 15, textAlign: "center", color: "#173B6B", lineHeight: 22 }}>
              {t.contactAfterPayment}
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
          {t.myBookings}
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
              {t.noPaidBookings}
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
                {booking.guideName || t.guide}
              </Text>
              <Text style={{ color: "#173B6B" }}>{t.email}: {booking.travelerEmail || booking.email || "-"}</Text>
              <Text style={{ color: "#173B6B" }}>{t.date}: {booking.date || "-"}</Text>
              <Text style={{ color: "#173B6B" }}>{t.hours}: {booking.hours ?? "-"}</Text>
              <Text style={{ color: "#173B6B" }}>{t.amount}: USD {Number(amount || 0).toFixed(2)}</Text>
              <Text style={{ color: "#15539A", fontWeight: "800" }}>{t.status}: {booking.status || "-"}</Text>

              <Pressable
                onPress={() => router.push({ pathname: "/chat", params: { bookingId: booking._id } })}
                style={{
                  marginTop: 10,
                  backgroundColor: "rgba(106,145,205,0.92)",
                  paddingVertical: 14,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "800" }}>
                  {t.openChat}
                </Text>
              </Pressable>
            </View>
          );
        })}

        <View style={{ height: 36 }} />
      </ScrollView>
    </ImageBackground>
  );
}