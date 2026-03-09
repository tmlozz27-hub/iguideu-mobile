import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { apiGet, apiPost } from "../../config/api";
import { clearReservationDraftGuide, getReservationDraftGuide } from "../../lib/reservationDraft";

type Guide = {
  _id?: string;
  id?: string;
  gid?: string;
  guideId?: string;
  name?: string;
  guideName?: string;
  city?: string;
  country?: string;
};

type Booking = {
  _id?: string;
  id?: string;
  guideId?: string;
  guideName?: string;
  travelerEmail?: string;
  travelerName?: string;
  hours?: number;
  durationHours?: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
  date?: string;
  amountCents?: number;
  totalCents?: number;
  totalAmountCents?: number;
  total?: number;
};

const DEFAULT_EMAIL = "test+frontend@iguideu.com";

function todayYYYYMMDD() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function bookingKey(booking: Booking, index: number) {
  return booking._id || booking.id || `${booking.guideName || "booking"}-${booking.createdAt || ""}-${index}`;
}

function guideKey(guide: Guide, index: number) {
  return guide._id || guide.id || guide.gid || guide.guideId || `${guide.guideName || guide.name || "guide"}-${guide.city || ""}-${index}`;
}

function guideLabel(guide: Guide) {
  return `${guide.guideName || guide.name || "Guía"}${guide.city ? " — " + guide.city : ""}`;
}

function bookingAmountText(booking: Booking) {
  const cents =
    booking.amountCents ??
    booking.totalAmountCents ??
    booking.totalCents ??
    (typeof booking.total === "number" ? booking.total * 100 : 0);

  if (!cents || cents <= 0) return "-";
  return `USD ${(cents / 100).toFixed(2)}`;
}

function isPaid(booking: Booking) {
  const value = String(booking.paymentStatus || booking.status || "").toUpperCase();
  return value === "PAID";
}

function guidesAreSame(a: Guide | null | undefined, b: Guide | null | undefined) {
  if (!a || !b) return false;

  return (
    String(a._id || "") === String(b._id || "") ||
    String(a.id || "") === String(b.id || "") ||
    String(a.gid || "") === String(b.gid || "") ||
    String(a.guideId || "") === String(b.guideId || "") ||
    (
      String(a.guideName || a.name || "").trim().toLowerCase() ===
        String(b.guideName || b.name || "").trim().toLowerCase() &&
      String(a.city || "").trim().toLowerCase() ===
        String(b.city || "").trim().toLowerCase()
    )
  );
}

function guideMatchesDraft(
  guide: Guide,
  draftGuideId: string,
  draftGuideName: string,
  draftCity: string
) {
  const sameId =
    String(guide._id || "") === draftGuideId ||
    String(guide.id || "") === draftGuideId ||
    String(guide.gid || "") === draftGuideId ||
    String(guide.guideId || "") === draftGuideId;

  const sameName =
    String(guide.guideName || guide.name || "").trim().toLowerCase() ===
    draftGuideName.trim().toLowerCase();

  const sameCity =
    String(guide.city || "").trim().toLowerCase() ===
    draftCity.trim().toLowerCase();

  return sameId || (sameName && (!draftCity || sameCity));
}

export default function ReservasScreen() {
  const initialDraftRef = useRef(getReservationDraftGuide());
  const draftConsumedRef = useRef(false);

  const [travelerEmail, setTravelerEmail] = useState(DEFAULT_EMAIL);
  const [date, setDate] = useState(todayYYYYMMDD());
  const [hours, setHours] = useState("1");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState<string>("");

  const normalizedEmail = useMemo(() => travelerEmail.trim().toLowerCase(), [travelerEmail]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const guidesRes = await apiGet<any>("/api/guides");
      const bookingsRes = await apiGet<any>("/api/bookings");

      const guidesList: Guide[] = Array.isArray(guidesRes)
        ? guidesRes
        : Array.isArray(guidesRes?.guides)
          ? guidesRes.guides
          : Array.isArray(guidesRes?.items)
            ? guidesRes.items
            : [];

      const bookingsList: Booking[] = Array.isArray(bookingsRes)
        ? bookingsRes
        : Array.isArray(bookingsRes?.bookings)
          ? bookingsRes.bookings
          : Array.isArray(bookingsRes?.items)
            ? bookingsRes.items
            : Array.isArray(bookingsRes?.data)
              ? bookingsRes.data
              : [];

      setGuides(guidesList);

      let nextSelected: Guide | null = selectedGuide;

      const draft = initialDraftRef.current;

      if (!draftConsumedRef.current && draft) {
        const draftGuideId = String(draft.guideId || "");
        const draftGuideName = String(draft.guideName || "");
        const draftCity = String(draft.city || "");

        const matched =
          guidesList.find((guide) => guideMatchesDraft(guide, draftGuideId, draftGuideName, draftCity)) || null;

        if (matched) {
          nextSelected = matched;
        }

        draftConsumedRef.current = true;
        clearReservationDraftGuide();
      }

      if (!nextSelected && guidesList.length > 0) {
        nextSelected = guidesList[0];
      }

      if (nextSelected && !guidesAreSame(selectedGuide, nextSelected)) {
        setSelectedGuide(nextSelected);
      }

      const filtered = bookingsList.filter((b) => {
        const email = String(b?.travelerEmail || "").trim().toLowerCase();
        return !normalizedEmail || email === normalizedEmail;
      });

      filtered.sort((a, b) => {
        const aa = new Date(b?.createdAt || 0).getTime();
        const bb = new Date(a?.createdAt || 0).getTime();
        return aa - bb;
      });

      setBookings(filtered);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [normalizedEmail, selectedGuide]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAll();
  }, [loadAll]);

  const createBooking = useCallback(async () => {
    const email = travelerEmail.trim().toLowerCase();
    const bookingDate = date.trim();
    const parsedHours = Number(hours);

    if (!email) {
      Alert.alert("Error", "travelerEmail is required");
      return;
    }

    if (!bookingDate) {
      Alert.alert("Error", "date is required (YYYY-MM-DD)");
      return;
    }

    if (!selectedGuide) {
      Alert.alert("Error", "Seleccioná un guía");
      return;
    }

    if (!Number.isFinite(parsedHours) || parsedHours <= 0) {
      Alert.alert("Error", "Ingresá horas válidas");
      return;
    }

    const guideId =
      selectedGuide._id ||
      selectedGuide.id ||
      selectedGuide.gid ||
      selectedGuide.guideId ||
      selectedGuide.guideName ||
      selectedGuide.name ||
      "";

    const guideName =
      selectedGuide.guideName ||
      selectedGuide.name ||
      "Guide";

    try {
      setCreating(true);

      await apiPost("/api/bookings", {
        travelerEmail: email,
        travelerName: "",
        guideId,
        guideName,
        city: selectedGuide.city || "",
        country: selectedGuide.country || "",
        date: bookingDate,
        hours: parsedHours,
        duration: "HOURS",
        total: parsedHours * 25
      });

      Alert.alert("OK", "Reserva creada");
      await loadAll();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "No se pudo crear la reserva");
    } finally {
      setCreating(false);
    }
  }, [travelerEmail, date, hours, selectedGuide, loadAll]);

  const markPaidTest = useCallback(async (booking: Booking) => {
    const bookingId = String(booking._id || booking.id || "");
    if (!bookingId) {
      Alert.alert("Error", "bookingId inválido");
      return;
    }

    try {
      setPayingBookingId(bookingId);
      await apiPost("/api/payments/pay-test", { bookingId });
      Alert.alert("OK", "Reserva marcada como PAID en test");
      await loadAll();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "No se pudo marcar pago test");
    } finally {
      setPayingBookingId("");
    }
  }, [loadAll]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Reservas</Text>

      <Text style={styles.label}>Traveler Email</Text>
      <TextInput
        value={travelerEmail}
        onChangeText={setTravelerEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholder="test+frontend@iguideu.com"
      />

      <Text style={styles.label}>Fecha</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        autoCapitalize="none"
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Guía</Text>
      <View style={styles.listBlock}>
        {guides.map((guide, index) => {
          const key = guideKey(guide, index);
          const label = guideLabel(guide);

          const selected =
            (selectedGuide?._id && selectedGuide?._id === guide._id) ||
            (selectedGuide?.id && selectedGuide?.id === guide.id) ||
            (selectedGuide?.gid && selectedGuide?.gid === guide.gid) ||
            (selectedGuide?.guideId && selectedGuide?.guideId === guide.guideId) ||
            (
              (selectedGuide?.guideName || selectedGuide?.name) === (guide.guideName || guide.name) &&
              (selectedGuide?.city || "") === (guide.city || "")
            );

          return (
            <Pressable
              key={key}
              onPress={() => setSelectedGuide(guide)}
              style={[styles.guideCard, selected && styles.guideCardSelected]}
            >
              <Text style={[styles.guideText, selected && styles.guideTextSelected]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Horas</Text>
      <TextInput
        value={hours}
        onChangeText={setHours}
        keyboardType="numeric"
        style={styles.hoursInput}
        placeholder="1"
      />

      <Pressable onPress={createBooking} style={styles.button} disabled={creating}>
        <Text style={styles.buttonText}>{creating ? "CREANDO..." : "CREAR RESERVA"}</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Mis reservas</Text>

      {loading ? (
        <Text style={styles.empty}>Cargando...</Text>
      ) : bookings.length === 0 ? (
        <Text style={styles.empty}>No hay reservas todavía.</Text>
      ) : (
        <View style={styles.listBlock}>
          {bookings.map((booking, index) => {
            const key = bookingKey(booking, index);
            const paid = isPaid(booking);
            const bookingId = String(booking._id || booking.id || "");
            const thisPaying = payingBookingId === bookingId;

            return (
              <View key={key} style={styles.bookingCard}>
                <Text style={styles.bookingTitle}>{booking.guideName || "Guía"}</Text>
                <Text style={styles.bookingLine}>Email: {booking.travelerEmail || "-"}</Text>
                <Text style={styles.bookingLine}>Fecha: {booking.date ? String(booking.date).slice(0, 10) : "-"}</Text>
                <Text style={styles.bookingLine}>Horas: {booking.hours ?? booking.durationHours ?? "-"}</Text>
                <Text style={styles.bookingLine}>Monto: {bookingAmountText(booking)}</Text>
                <Text style={styles.bookingLine}>Estado: {booking.paymentStatus || booking.status || "-"}</Text>

                {!paid && !!bookingId && (
                  <Pressable
                    onPress={() => markPaidTest(booking)}
                    style={[styles.payButton, thisPaying && styles.payButtonDisabled]}
                    disabled={thisPaying}
                  >
                    <Text style={styles.payButtonText}>{thisPaying ? "PROCESANDO..." : "PAGAR TEST"}</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  content: {
    padding: 24,
    paddingBottom: 120
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 24,
    color: "#000"
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000"
  },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 24
  },
  hoursInput: {
    width: 120,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 24
  },
  listBlock: {
    marginBottom: 18
  },
  guideCard: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 22,
    marginBottom: 16,
    backgroundColor: "#fff"
  },
  guideCardSelected: {
    backgroundColor: "#000"
  },
  guideText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000"
  },
  guideTextSelected: {
    color: "#fff"
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800"
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 18,
    color: "#000"
  },
  empty: {
    fontSize: 16,
    color: "#333"
  },
  bookingCard: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
    backgroundColor: "#fff"
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    color: "#000"
  },
  bookingLine: {
    fontSize: 16,
    color: "#000",
    marginBottom: 2
  },
  payButton: {
    marginTop: 14,
    backgroundColor: "#000",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  payButtonDisabled: {
    opacity: 0.7
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800"
  }
});