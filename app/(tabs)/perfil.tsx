import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet, apiPut } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

type MeUser = {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
};

type GuideProfile = {
  name?: string;
  fullName?: string;
  role?: string;
  city?: string;
  country?: string;
  bio?: string;
  languages?: string[] | string;
  rating?: number;
  priceHour?: number;
  pricePerHour?: number;
  priceDay?: number;
  price8h?: number;
  price24h?: number;
  priceFullDay24h?: number;
  profilePhotoUrl?: string;
  avatarUrl?: string;
  photoUrl?: string;
  photos?: string[] | string;
  gallery?: string[] | string;
  images?: string[] | string;
  videoUrl?: string;
  video?: string;
};

type MediaItem = {
  type: "photo" | "video";
  uri?: string;
  label: string;
};

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }
  return [];
}

function formatUsd(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "-";
  return `USD ${value}`;
}

function buildGuideMedia(profile: GuideProfile): MediaItem[] {
  const photos = [
    profile.profilePhotoUrl,
    profile.avatarUrl,
    profile.photoUrl,
    ...toArray(profile.photos),
    ...toArray(profile.gallery),
    ...toArray(profile.images)
  ].filter(Boolean) as string[];

  const unique = Array.from(new Set(photos)).slice(0, 4);

  const result: MediaItem[] = unique.map((uri, i) => ({
    type: "photo",
    uri,
    label: `Foto ${i + 1}`
  }));

  return [
    ...result,
    { type: "video", uri: profile.videoUrl || profile.video, label: "Video" }
  ];
}

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<MeUser | null>(null);
  const [guideProfile, setGuideProfile] = useState<GuideProfile | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoadingUser(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const data = await apiGet("/api/auth/me", headers);

      const u = data?.user || data;
      setUser(u || null);
      setNameInput(String(u?.name || u?.fullName || ""));

      if (u?.role === "guide") {
        const g = await apiGet("/api/guides/me", headers);
        setGuideProfile(g?.guide || g || null);
      } else {
        setGuideProfile(null);
      }
    } catch {
      setUser(null);
      setGuideProfile(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      await apiPut(
        "/api/auth/me",
        { name: nameInput },
        { Authorization: `Bearer ${token}` }
      );

      Alert.alert("OK", "Perfil actualizado");
      await loadUser();
    } catch {
      Alert.alert("Error", "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_EMAIL_KEY]);
      router.replace("/login");
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  const isGuide = user?.role === "guide";

  const media = useMemo(() => buildGuideMedia(guideProfile || {}), [guideProfile]);
  const mainPhoto = media.find((item) => item.type === "photo" && item.uri)?.uri;

  if (!isGuide) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={{ fontSize: 32, fontWeight: "800", color: "#111827", marginBottom: 20 }}>
            Perfil
          </Text>

          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 18,
              padding: 18
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#6b7280",
                marginBottom: 8
              }}
            >
              Email
            </Text>

            <Text
              style={{
                fontSize: 18,
                color: "#111827",
                marginBottom: 18
              }}
            >
              {loadingUser ? "Cargando..." : user?.email || "-"}
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#6b7280",
                marginBottom: 8
              }}
            >
              Nombre
            </Text>

            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Tu nombre"
              autoCapitalize="words"
              style={{
                backgroundColor: "#f9fafb",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 14,
                fontSize: 17,
                color: "#111827",
                marginBottom: 16
              }}
            />

            <Pressable
              onPress={handleSave}
              disabled={saving || loadingUser}
              style={{
                backgroundColor: saving || loadingUser ? "#93c5fd" : "#2563eb",
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                marginBottom: 12
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: "800"
                }}
              >
                {saving ? "Guardando..." : "Guardar"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              style={{
                backgroundColor: "#dc2626",
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: "800"
                }}
              >
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f4e97" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "800", marginBottom: 16 }}>
          Perfil del guía
        </Text>

        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: 18,
            marginBottom: 16
          }}
        >
          {mainPhoto ? (
            <Image
              source={{ uri: mainPhoto }}
              style={{
                width: "100%",
                height: 220,
                borderRadius: 16,
                marginBottom: 16
              }}
              resizeMode="cover"
            />
          ) : null}

          <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827", marginBottom: 6 }}>
            {guideProfile?.name || guideProfile?.fullName || user?.name || "Guía"}
          </Text>

          <Text style={{ fontSize: 16, color: "#4b5563", marginBottom: 12 }}>
            {[guideProfile?.city, guideProfile?.country].filter(Boolean).join(", ") || "-"}
          </Text>

          <Text style={{ fontSize: 14, fontWeight: "700", color: "#6b7280", marginBottom: 6 }}>
            Email
          </Text>

          <Text style={{ fontSize: 16, color: "#111827", marginBottom: 16 }}>
            {user?.email || "-"}
          </Text>

          <Text style={{ fontSize: 14, fontWeight: "700", color: "#6b7280", marginBottom: 8 }}>
            Nombre
          </Text>

          <TextInput
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Tu nombre"
            autoCapitalize="words"
            style={{
              backgroundColor: "#f9fafb",
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 14,
              fontSize: 17,
              color: "#111827",
              marginBottom: 16
            }}
          />

          <Text style={{ fontSize: 14, fontWeight: "700", color: "#6b7280", marginBottom: 8 }}>
            Sobre mí
          </Text>

          <Text style={{ fontSize: 16, color: "#111827", lineHeight: 22, marginBottom: 16 }}>
            {guideProfile?.bio || "-"}
          </Text>

          <Text style={{ fontSize: 14, fontWeight: "700", color: "#6b7280", marginBottom: 8 }}>
            Tarifas
          </Text>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 16, color: "#111827", marginBottom: 6 }}>
              Por hora: {formatUsd(Number(guideProfile?.priceHour || guideProfile?.pricePerHour || 0))}
            </Text>

            <Text style={{ fontSize: 16, color: "#111827", marginBottom: 6 }}>
              8 horas: {formatUsd(Number(guideProfile?.price8h || 0))}
            </Text>

            <Text style={{ fontSize: 16, color: "#111827", marginBottom: 6 }}>
              Por día: {formatUsd(Number(guideProfile?.priceDay || 0))}
            </Text>

            <Text style={{ fontSize: 16, color: "#111827" }}>
              24 horas: {formatUsd(Number(guideProfile?.price24h || guideProfile?.priceFullDay24h || 0))}
            </Text>
          </View>

          <Text
            style={{
              color: "#374151",
              fontSize: 15,
              textAlign: "center",
              marginBottom: 18
            }}
          >
            El chat con el guía se habilita únicamente después del pago.
          </Text>

          <Pressable
            onPress={handleSave}
            disabled={saving || loadingUser}
            style={{
              backgroundColor: saving || loadingUser ? "#93c5fd" : "#2563eb",
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 12
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: "800"
              }}
            >
              {saving ? "Guardando..." : "Guardar"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: "800"
              }}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}