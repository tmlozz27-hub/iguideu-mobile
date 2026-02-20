import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { apiGet, apiPost } from "../../config/api";

type Guide = { id: string; name: string; city?: string; rating?: number };
type Booking = { _id?: string; id?: string; email: string; guideId: string; hours: number; status?: string; createdAt?: string };

export default function ReservasScreen() {
  const [email, setEmail] = useState("test+frontend@iguideu.com");
  const [hours, setHours] = useState("1");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState<string>("g1");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedGuide = useMemo(() => guides.find(g => g.id === selectedGuideId), [guides, selectedGuideId]);

  async function loadGuides() {
    const res = await apiGet("/api/guides");
    const list = Array.isArray(res?.guides) ? res.guides : Array.isArray(res) ? res : [];
    setGuides(list);
    if (list.length && !list.some(g => g.id === selectedGuideId)) setSelectedGuideId(list[0].id);
  }

  async function loadBookings(currentEmail: string) {
    const enc = encodeURIComponent((currentEmail || "").trim());
    const res = await apiGet(`/api/bookings?email=${enc}`);
    const list = Array.isArray(res) ? res : Array.isArray(res?.bookings) ? res.bookings : [];
    setBookings(list);
  }

  async function createBooking() {
    const e = (email || "").trim();
    const h = Number(hours);
    if (!e || !e.includes("@")) return Alert.alert("Error", "Email inválido");
    if (!selectedGuideId) return Alert.alert("Error", "Elegí un guía");
    if (!Number.isFinite(h) || h <= 0) return Alert.alert("Error", "Horas inválidas");

    setLoading(true);
    try {
      const payload = { email: e, guideId: selectedGuideId, hours: h };
      const res = await apiPost("/api/bookings", payload);
      await loadBookings(e);
      Alert.alert("OK", "Reserva creada");
      return res;
    } catch (err: any) {
      const msg = String(err?.message || err || "Error");
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuides().catch(() => {});
    loadBookings(email).catch(() => {});
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      <Text style={{ fontSize: 40, fontWeight: "800", marginBottom: 16 }}>Reservas</Text>

      <Text style={{ fontSize: 16, marginBottom: 6 }}>Traveler Email</Text>
      <TextInput
        value={email}
        onChangeText={(t) => setEmail(t)}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 2, borderColor: "#000", borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 18 }}
      />

      <Text style={{ fontSize: 16, marginBottom: 8 }}>Guía</Text>
      <View style={{ gap: 12, marginBottom: 18 }}>
        {guides.map((g) => {
          const active = g.id === selectedGuideId;
          return (
            <Pressable
              key={g.id}
              onPress={() => setSelectedGuideId(g.id)}
              style={{
                borderWidth: 2,
                borderColor: "#000",
                borderRadius: 14,
                padding: 16,
                backgroundColor: active ? "#000" : "#fff",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: active ? "#fff" : "#000" }}>
                {g.name} — {g.city || "Ciudad"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontSize: 16, marginBottom: 8 }}>Horas</Text>
      <TextInput
        value={hours}
        onChangeText={setHours}
        keyboardType="numeric"
        style={{ width: 120, borderWidth: 2, borderColor: "#000", borderRadius: 14, padding: 14, fontSize: 18, marginBottom: 18 }}
      />

      <Pressable
        onPress={createBooking}
        disabled={loading}
        style={{
          backgroundColor: "#000",
          borderRadius: 18,
          paddingVertical: 18,
          alignItems: "center",
          opacity: loading ? 0.6 : 1,
          marginBottom: 28,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>{loading ? "CREANDO..." : "CREAR RESERVA"}</Text>
      </Pressable>

      <Text style={{ fontSize: 32, fontWeight: "800", marginBottom: 12 }}>Mis reservas</Text>

      {bookings.length === 0 ? (
        <Text style={{ fontSize: 16 }}>No hay reservas todavía.</Text>
      ) : (
        <View style={{ gap: 12 }}>
          {bookings.map((b, idx) => {
            const gid = (b as any).guideId || (b as any).gid || "";
            const g = guides.find(x => x.id === gid);
            const title = g ? `${g.name} — ${g.city || "Ciudad"}` : `Guía ${gid || ""}`.trim();
            return (
              <View key={(b as any)._id || (b as any).id || String(idx)} style={{ borderWidth: 2, borderColor: "#000", borderRadius: 14, padding: 14 }}>
                <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 6 }}>{title}</Text>
                <Text style={{ fontSize: 14 }}>Email: {(b as any).email}</Text>
                <Text style={{ fontSize: 14 }}>Horas: {(b as any).hours}</Text>
                <Text style={{ fontSize: 14 }}>Estado: {(b as any).status || "PENDING"}</Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
