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
  createdAt?: string | null;
  updatedAt?: string | null;
};

type GuideProfile = {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  city?: string;
  country?: string;
  bio?: string;
  languages?: string[] | string;
  guideType?: string;
  rating?: number;
  certified?: boolean;
  verified?: boolean;
  priceHour?: number;
  pricePerHour?: number;
  priceDay?: number;
  price8h?: number;
  price24h?: number;
  priceFullDay24h?: number;
  profilePhotoUrl?: string;
  avatarUrl?: string;
  photoUrl?: string;
  photos?: string[];
  gallery?: string[];
  images?: string[];
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
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function formatUsd(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "-";
  return `USD ${value}`;
}

function buildGuideMedia(profile: GuideProfile): MediaItem[] {
  const photoCandidates = [
    profile.profilePhotoUrl,
    profile.avatarUrl,
    profile.photoUrl,
    ...toArray(profile.photos),
    ...toArray(profile.gallery),
    ...toArray(profile.images)
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  const uniquePhotos = Array.from(new Set(photoCandidates)).slice(0, 4);
  const photos: MediaItem[] = [];

  for (let i = 0; i < 4; i += 1) {
    photos.push({
      type: "photo",
      uri: uniquePhotos[i],
      label: `Foto ${i + 1}`
    });
  }

  const videoUri = String(profile.videoUrl || profile.video || "").trim();

  return [
    ...photos,
    {
      type: "video",
      uri: videoUri,
      label: "Video 0:45"
    }
  ];
}

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<MeUser | null>(null);
  const [guideProfile, setGuideProfile] = useState<GuideProfile | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        setUser(null);
        setGuideProfile(null);
        setLoadingUser(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const authData = await apiGet("/api/auth/me", headers);
      const authUser = authData?.user || authData || null;

      if (!authData?.ok || !authUser) {
        setUser(null);
        setGuideProfile(null);
        setLoadingUser(false);
        return;
      }

      setUser(authUser);
      setNameInput(String(authUser?.name || authUser?.fullName || ""));

      if (authUser?.email) {
        await AsyncStorage.setItem(USER_EMAIL_KEY, String(authUser.email));
      }

      const userRole = String(authUser?.role || "").trim().toLowerCase();

      if (userRole === "guide") {
        try {
          const guideData = await apiGet("/api/guides/me", headers);
          const guide = guideData?.guide || guideData?.item || guideData || null;
          setGuideProfile(guide || authUser);
        } catch {
          setGuideProfile(authUser);
        }
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

  const handleSaveProfile = async () => {
    const nextName = String(nameInput || "").trim();

    if (!nextName) {
      Alert.alert("Falta el nombre", "Ingresá un nombre válido.");
      return;
    }

    try {
      setSaving(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        Alert.alert("Error", "No hay sesión activa.");
        return;
      }

      const data = await apiPut(
        "/api/auth/me",
        { name: nextName },
        {
          Authorization: `Bearer ${token}`
        }
      );

      if (!data?.ok || !data?.user) {
        Alert.alert("Error", data?.message || "No se pudo actualizar el perfil.");
        return;
      }

      setUser(data.user);
      setNameInput(String(data.user?.name || data.user?.fullName || ""));

      if (String(data.user?.role || "").trim().toLowerCase() === "guide") {
        setGuideProfile((prev) => ({
          ...(prev || {}),
          ...(data.user || {}),
          name: data.user?.name || data.user?.fullName || prev?.name || ""
        }));
      }

      Alert.alert("OK", "Perfil actualizado.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo conectar con el servidor.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_EMAIL_KEY]);
      router.replace("/login");
    } catch {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  const confirmLogout = () => {
    Alert.alert("Cerrar sesión", "¿Querés salir de tu cuenta ahora?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: handleLogout }
    ]);
  };

  const isGuide = String(user?.role || guideProfile?.role || "")
    .trim()
    .toLowerCase() === "guide";

  const guideName = String(
    guideProfile?.name ||
      guideProfile?.fullName ||
      user?.name ||
      user?.fullName ||
      "Tu nombre"
  ).trim();

  const guideCity = String(guideProfile?.city || "").trim();
  const guideCountry = String(guideProfile?.country || "").trim();
  const guideLocation = [guideCity, guideCountry].filter(Boolean).join(", ") || "Ciudad, País";

  const guideBio =
    String(guideProfile?.bio || "").trim() ||
    "Guía local con experiencia acompañando viajeros y creando experiencias personalizadas.";

  const guideLanguages = toArray(guideProfile?.languages);
  const guideLanguagesText = guideLanguages.length > 0 ? guideLanguages.join(", ") : "-";

  const ratingValue = Number(guideProfile?.rating || 4.9);
  const ratingText = Number.isFinite(ratingValue) ? ratingValue.toFixed(1) : "4.9";

  const priceHour = Number(
    guideProfile?.priceHour ?? guideProfile?.pricePerHour ?? 20
  );
  const price8h = Number(
    guideProfile?.priceDay ?? guideProfile?.price8h ?? (Number.isFinite(priceHour) ? priceHour * 8 : 120)
  );
  const price24h = Number(
    guideProfile?.price24h ?? guideProfile?.priceFullDay24h ?? 0
  );

  const mediaItems = useMemo(() => buildGuideMedia(guideProfile || {}), [guideProfile]);

  const mainPhoto =
    mediaItems.find((item) => item.type === "photo" && item.uri)?.uri || "";

  const openMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    setMediaModalVisible(true);
  };

  const closeMedia = () => {
    setMediaModalVisible(false);
    setSelectedMedia(null);
  };

  if (!isGuide) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 40 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 4 }}>
            Perfil
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 16,
              padding: 16,
              backgroundColor: "#ffffff"
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 12 }}>
              Mi cuenta
            </Text>

            <Text style={{ marginBottom: 8 }}>
              Email: {loadingUser ? "Cargando..." : user?.email || "No disponible"}
            </Text>

            <Text style={{ marginBottom: 8 }}>
              Rol: {loadingUser ? "Cargando..." : user?.role || "traveler"}
            </Text>

            <Text style={{ marginBottom: 8, fontWeight: "700" }}>
              Nombre
            </Text>

            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Tu nombre"
              editable={!loadingUser && !saving}
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                fontSize: 16,
                backgroundColor: "#ffffff",
                marginBottom: 12
              }}
            />

            <Pressable
              onPress={handleSaveProfile}
              disabled={loadingUser || saving}
              style={{
                backgroundColor: "#0f9fb3",
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
                opacity: loadingUser || saving ? 0.7 : 1
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "800", fontSize: 16 }}>
                {saving ? "Guardando..." : "Guardar perfil"}
              </Text>
            </Pressable>
          </View>

          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => router.push("/legal/terms")}
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                padding: 14,
                backgroundColor: "#ffffff"
              }}
            >
              <Text style={{ fontWeight: "800", color: "#111827" }}>
                Términos y condiciones
              </Text>
              <Text style={{ opacity: 0.8, marginTop: 4, color: "#374151" }}>
                Ver condiciones de uso de I GUIDE U
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/legal/privacy")}
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                padding: 14,
                backgroundColor: "#ffffff"
              }}
            >
              <Text style={{ fontWeight: "800", color: "#111827" }}>
                Política de privacidad
              </Text>
              <Text style={{ opacity: 0.8, marginTop: 4, color: "#374151" }}>
                Ver cómo se tratan y protegen tus datos
              </Text>
            </Pressable>

            <Pressable
              onPress={confirmLogout}
              style={{
                borderWidth: 1,
                borderColor: "#ef4444",
                borderRadius: 12,
                padding: 14,
                backgroundColor: "#fff5f5"
              }}
            >
              <Text style={{ fontWeight: "800", color: "#b91c1c" }}>
                Cerrar sesión
              </Text>
              <Text style={{ opacity: 0.8, marginTop: 4, color: "#7f1d1d" }}>
                Borra la sesión local y vuelve al login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f4e97" }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <Text
          style={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 18
          }}
        >
          Perfil del guía
        </Text>

        <View
          style={{
            backgroundColor: "#2b66ab",
            borderRadius: 28,
            padding: 20
          }}
        >
          <View style={{ alignItems: "center" }}>
            {mainPhoto ? (
              <Pressable onPress={() => openMedia({ type: "photo", uri: mainPhoto, label: "Foto principal" })}>
                <Image
                  source={{ uri: mainPhoto }}
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: 85,
                    backgroundColor: "#d9d9d9"
                  }}
                />
              </Pressable>
            ) : (
              <View
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 85,
                  backgroundColor: "#d9d9d9"
                }}
              />
            )}

            <Text
              style={{
                color: "#ffffff",
                fontSize: 34,
                fontWeight: "800",
                marginTop: 18,
                textAlign: "center"
              }}
            >
              {guideName}
            </Text>

            <View
              style={{
                marginTop: 16,
                backgroundColor: "#23c7b7",
                paddingHorizontal: 26,
                paddingVertical: 12,
                borderRadius: 30
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "800" }}>
                CERTIFIED
              </Text>
            </View>

            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                marginTop: 20,
                textAlign: "center"
              }}
            >
              {guideLocation}
            </Text>

            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                marginTop: 10
              }}
            >
              ★ {ratingText}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, marginTop: 24, paddingRight: 4 }}
          >
            {mediaItems.map((item, index) => (
              <Pressable
                key={`${item.type}-${index}`}
                onPress={() => openMedia(item)}
                style={{
                  width: 150,
                  height: 110,
                  borderRadius: 22,
                  backgroundColor: item.type === "video" ? "#091633" : index % 2 === 0 ? "#8bb5e5" : "#6ba1e8",
                  borderWidth: item.type === "video" ? 3 : 0,
                  borderColor: item.type === "video" ? "#23c7b7" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}
              >
                {item.uri && item.type === "photo" ? (
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    {item.type === "video" ? (
                      <>
                        <Text style={{ color: "#ffffff", fontSize: 26, marginBottom: 8 }}>
                          ▶
                        </Text>
                        <Text style={{ color: "#ffffff", fontSize: 14 }}>
                          {item.label}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: "#1b4d87", fontSize: 16, fontWeight: "800" }}>
                        {item.label}
                      </Text>
                    )}
                  </>
                )}
              </Pressable>
            ))}
          </ScrollView>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: "800",
              marginTop: 28
            }}
          >
            Sobre mí
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              lineHeight: 34,
              marginTop: 16
            }}
          >
            {guideBio}
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              marginTop: 30,
              opacity: 0.95
            }}
          >
            Ubicación
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              marginTop: 10
            }}
          >
            {guideLocation}
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              marginTop: 28,
              opacity: 0.95
            }}
          >
            Idiomas
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              marginTop: 10
            }}
          >
            {guideLanguagesText}
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              marginTop: 28,
              opacity: 0.95
            }}
          >
            Tipo de jornada
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              marginTop: 10
            }}
          >
            Por hora, 8 horas, 24 horas
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#2b66ab",
            borderRadius: 28,
            padding: 20,
            marginTop: 18
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 22, marginBottom: 18 }}>
            Tarifas
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, marginBottom: 18 }}>
            Por hora: {formatUsd(priceHour)}
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, marginBottom: 18 }}>
            Jornada de 8h: {formatUsd(price8h)}
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18 }}>
            24 horas: {formatUsd(price24h)}
          </Text>

          <View
            style={{
              marginTop: 24,
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.2)",
              paddingTop: 18
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
              Tarifas por edad
            </Text>

            <Text style={{ color: "#ffffff", fontSize: 17, marginBottom: 10 }}>
              • 12 años o menos: sin cargo
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 17, marginBottom: 10 }}>
              • 13 a 17 años: 50% de descuento
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 17 }}>
              • 18 años o más: tarifa completa
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#2b66ab",
            borderRadius: 28,
            padding: 20,
            marginTop: 18,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.18)"
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "800", marginBottom: 18 }}>
            Antes de reservar
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, lineHeight: 31, marginBottom: 16 }}>
            • Cada guía ofrece una experiencia personalizada según tus intereses
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, lineHeight: 31, marginBottom: 16 }}>
            • Podés coordinar directamente los detalles para adaptar el recorrido
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, lineHeight: 31, marginBottom: 16 }}>
            • Las tarifas corresponden al servicio del guía según la modalidad indicada
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, lineHeight: 31, marginBottom: 16 }}>
            • Gastos como comidas, transporte o entradas no están incluidos salvo que se indique expresamente
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, lineHeight: 31, marginBottom: 16 }}>
            • En actividades compartidas, el viajero cubre también los gastos del guía
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 18, lineHeight: 31 }}>
            • Reservando a través de la plataforma asegurás una experiencia clara, segura y registrada
          </Text>
        </View>

        <Pressable
          onPress={() => Alert.alert("Perfil del guía", "Esta base ya quedó lista. El siguiente paso es conectar edición completa y media real.")}
          style={{
            marginTop: 22,
            backgroundColor: "#23c7b7",
            borderRadius: 24,
            paddingVertical: 22,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800" }}>
            Solicitar servicio
          </Text>
        </Pressable>

        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            textAlign: "center",
            marginTop: 18,
            lineHeight: 24
          }}
        >
          El chat con el guía se habilita únicamente después del pago.
        </Text>

        <View style={{ marginTop: 22 }}>
          <Pressable
            onPress={handleSaveProfile}
            disabled={loadingUser || saving}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              opacity: loadingUser || saving ? 0.7 : 1
            }}
          >
            <Text style={{ color: "#0f4e97", fontWeight: "800", fontSize: 16 }}>
              {saving ? "Guardando..." : "Guardar nombre actual"}
            </Text>
          </Pressable>

          <TextInput
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Actualizar nombre visible"
            editable={!loadingUser && !saving}
            style={{
              marginTop: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.35)",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 14,
              fontSize: 16,
              backgroundColor: "#ffffff"
            }}
          />

          <Pressable
            onPress={() => router.push("/legal/terms")}
            style={{
              marginTop: 14,
              backgroundColor: "#ffffff",
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#0f4e97", fontWeight: "700" }}>
              Términos y condiciones
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/legal/privacy")}
            style={{
              marginTop: 10,
              backgroundColor: "#ffffff",
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#0f4e97", fontWeight: "700" }}>
              Política de privacidad
            </Text>
          </Pressable>

          <Pressable
            onPress={confirmLogout}
            style={{
              marginTop: 10,
              backgroundColor: "#fff5f5",
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#ef4444"
            }}
          >
            <Text style={{ color: "#b91c1c", fontWeight: "800" }}>
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={mediaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMedia}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.92)",
            alignItems: "center",
            justifyContent: "center",
            padding: 24
          }}
        >
          <Pressable
            onPress={closeMedia}
            style={{
              position: "absolute",
              top: 54,
              right: 22,
              zIndex: 2
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "800" }}>
              ✕
            </Text>
          </Pressable>

          {selectedMedia?.uri && selectedMedia.type === "photo" ? (
            <Image
              source={{ uri: selectedMedia.uri }}
              style={{
                width: "100%",
                height: 360,
                borderRadius: 18,
                backgroundColor: "#111827"
              }}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: 360,
                borderRadius: 18,
                backgroundColor: "#111827",
                alignItems: "center",
                justifyContent: "center",
                padding: 24
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 36, marginBottom: 12 }}>
                {selectedMedia?.type === "video" ? "▶" : "🖼"}
              </Text>
              <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800", textAlign: "center" }}>
                {selectedMedia?.label || "Vista previa"}
              </Text>
              <Text style={{ color: "#d1d5db", fontSize: 16, textAlign: "center", marginTop: 10 }}>
                Cuando conectemos media real, acá se abrirá la foto o video en grande.
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}