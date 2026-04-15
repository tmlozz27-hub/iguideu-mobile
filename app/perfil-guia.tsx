import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { API_BASE } from "@/config/api";

type PickedMedia = {
  uri: string;
};

export default function PerfilGuia() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = useState("");
  const [bio, setBio] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [price24h, setPrice24h] = useState("");
  const [guideType, setGuideType] = useState<"certified" | "freelance">("certified");
  const [galleryPhotos, setGalleryPhotos] = useState<PickedMedia[]>([]);
  const [video, setVideo] = useState<PickedMedia | null>(null);
  const [mainPhoto, setMainPhoto] = useState<PickedMedia | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const gallerySlots = useMemo(() => {
    return [0, 1, 2, 3].map((i) => galleryPhotos[i] || null);
  }, [galleryPhotos]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8
    });

    if (!result.canceled) {
      return { uri: result.assets[0].uri };
    }

    return null;
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      videoMaxDuration: 45
    });

    if (!result.canceled) {
      setVideo({ uri: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanCity = city.trim();
    const cleanCountry = country.trim();
    const cleanLanguages = languages.trim();
    const cleanBio = bio.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanCity || !cleanCountry) {
      Alert.alert("Faltan datos", "Completá nombre, email, teléfono, ciudad y país.");
      return;
    }

    if (!acceptTerms) {
      Alert.alert("Error", "Debes aceptar los términos y condiciones");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/guides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          city: cleanCity,
          country: cleanCountry,
          languages: cleanLanguages,
          bio: cleanBio,
          priceHour: Number(priceHour) || 0,
          priceDay: Number(priceDay) || 0,
          price24h: Number(price24h) || 0,
          guideType,
          active: true,
          mediaDraft: {
            mainPhoto: mainPhoto ? { uri: mainPhoto.uri } : null,
            galleryPhotos: galleryPhotos.map((item) => ({ uri: item.uri })),
            video: video ? { uri: video.uri } : null
          }
        })
      });

      const text = await response.text();

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert("Error servidor", "El backend no respondió JSON. Revisar endpoint.");
        return;
      }

      if (!response.ok || !data?.ok) {
        Alert.alert("Error", data?.error || "No se pudo guardar el perfil.");
        return;
      }

      Alert.alert("Perfil creado", "Tu perfil de guía ya está activo.");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
      }}
      style={{ flex: 1, backgroundColor: "#0B3E91" }}
      resizeMode="cover"
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(11,62,145,0.74)"
        }}
      />
      <View
        style={{
          position: "absolute",
          top: -40,
          right: -20,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: "rgba(88,196,255,0.14)"
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 140,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: "rgba(18,184,166,0.10)"
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={title}>Completar perfil de guía</Text>

        <Pressable
          style={mainBox}
          onPress={async () => {
            if (loading) return;
            const img = await pickImage();
            if (img) setMainPhoto(img);
          }}
        >
          {mainPhoto ? (
            <Image source={{ uri: mainPhoto.uri }} style={mainImg} />
          ) : (
            <View style={mainPlaceholder}>
              <Text style={mainPlaceholderTitle}>Foto principal</Text>
              <Text style={mainPlaceholderSubtitle}>Tocá para cargar tu imagen principal</Text>
            </View>
          )}
        </Pressable>

        <View style={typeSection}>
          <Pressable
            onPress={() => setGuideType("certified")}
            style={[typeButton, guideType === "certified" ? typeButtonActive : null]}
          >
            <Text style={typeButtonText}>Certificado</Text>
          </Pressable>

          <Pressable
            onPress={() => setGuideType("freelance")}
            style={[typeButton, guideType === "freelance" ? typeButtonActive : null]}
          >
            <Text style={typeButtonText}>Freelance</Text>
            <Text style={typeHint}>sin título oficial</Text>
          </Pressable>
        </View>

        <View style={glassCard}>
          <TextInput
            placeholder="Nombre completo"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
            style={input}
            editable={!loading}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            style={input}
            editable={!loading}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Teléfono"
            placeholderTextColor="#6b7280"
            value={phone}
            onChangeText={setPhone}
            style={input}
            editable={!loading}
          />

          <View style={rowFields}>
            <TextInput
              placeholder="Ciudad"
              placeholderTextColor="#6b7280"
              value={city}
              onChangeText={setCity}
              style={[input, halfInput]}
              editable={!loading}
            />
            <TextInput
              placeholder="País"
              placeholderTextColor="#6b7280"
              value={country}
              onChangeText={setCountry}
              style={[input, halfInput]}
              editable={!loading}
            />
          </View>

          <Text style={section}>Fotos + Video</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={row}>
            {gallerySlots.map((item, i) => (
              <View key={i} style={card}>
                {item ? (
                  <Image source={{ uri: item.uri }} style={img} />
                ) : (
                  <Pressable
                    onPress={async () => {
                      if (loading) return;
                      const picked = await pickImage();
                      if (picked) {
                        const copy = [...galleryPhotos];
                        copy[i] = picked;
                        setGalleryPhotos(copy);
                      }
                    }}
                    style={cardInner}
                  >
                    <Text style={cardText}>Foto {i + 1}</Text>
                  </Pressable>
                )}
              </View>
            ))}

            <View style={card}>
              {video ? (
                <View style={cardInner}>
                  <Text style={videoEmoji}>🎬</Text>
                  <Text style={videoText}>Video</Text>
                  <Pressable onPress={() => setVideo(null)} style={removeBtn}>
                    <Text style={removeBtnText}>Quitar</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={pickVideo} style={cardInner}>
                  <Text style={cardText}>Video</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>

          <TextInput
            placeholder="Idiomas"
            placeholderTextColor="#6b7280"
            value={languages}
            onChangeText={setLanguages}
            style={input}
            editable={!loading}
          />

          <TextInput
            placeholder="Bio"
            placeholderTextColor="#6b7280"
            value={bio}
            onChangeText={setBio}
            style={[input, bioInput]}
            editable={!loading}
            multiline
            textAlignVertical="top"
          />

          <Text style={section}>Tarifas</Text>

          <TextInput
            placeholder="Precio por hora"
            placeholderTextColor="#6b7280"
            value={priceHour}
            onChangeText={setPriceHour}
            style={input}
            editable={!loading}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Precio jornada"
            placeholderTextColor="#6b7280"
            value={priceDay}
            onChangeText={setPriceDay}
            style={input}
            editable={!loading}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Precio 24h"
            placeholderTextColor="#6b7280"
            value={price24h}
            onChangeText={setPrice24h}
            style={input}
            editable={!loading}
            keyboardType="numeric"
          />

          <View style={rulesBox}>
            <Text style={rulesTitle}>Antes de ofrecer tu servicio</Text>
            <Text style={ruleLine}>• Tus tarifas deben corresponder al servicio indicado.</Text>
            <Text style={ruleLine}>• Comidas, transporte o entradas no están incluidas salvo que lo aclares expresamente.</Text>
            <Text style={ruleLine}>• Si el recorrido implica gastos compartidos, deben quedar claros antes de confirmar.</Text>
            <Text style={ruleLine}>• Mantené tu información, idiomas y precios siempre actualizados.</Text>
            <Text style={ruleLine}>• Al aceptar una solicitud, el servicio queda registrado dentro de la plataforma.</Text>
          </View>

          <Pressable
            onPress={() => setAcceptTerms((prev) => !prev)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#fff",
                backgroundColor: acceptTerms ? "#12b8a6" : "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10
              }}
            >
              {acceptTerms && (
                <Text style={{ color: "#fff", fontWeight: "800" }}>✓</Text>
              )}
            </View>

            <Text style={{ color: "#fff", flex: 1 }}>
              Acepto los términos y condiciones
            </Text>
          </Pressable>

          <Pressable onPress={handleSave} style={[btn, loading ? btnDisabled : null]} disabled={loading}>
            <Text style={btnText}>{loading ? "Guardando..." : "Guardar perfil"}</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/reservas")}
            style={secondaryBtn}
          >
            <Text style={secondaryBtnText}>Mis reservas</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const title = {
  color: "#fff",
  fontSize: 30,
  fontWeight: "800" as const,
  textAlign: "center" as const,
  marginBottom: 20,
  textShadowColor: "rgba(0,0,0,0.18)",
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8
};

const glassCard = {
  backgroundColor: "rgba(255,255,255,0.08)",
  borderRadius: 22,
  padding: 16,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.16)"
};

const input = {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
  color: "#173B6B"
};

const halfInput = {
  flex: 1
};

const bioInput = {
  height: 110
};

const section = {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700" as const,
  marginTop: 10,
  marginBottom: 10
};

const typeSection = {
  flexDirection: "row" as const,
  gap: 10,
  marginBottom: 14
};

const typeButton = {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.12)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.18)",
  borderRadius: 14,
  paddingVertical: 12,
  paddingHorizontal: 10,
  alignItems: "center" as const
};

const typeButtonActive = {
  backgroundColor: "#12b8a6",
  borderColor: "#12b8a6"
};

const typeButtonText = {
  color: "#fff",
  fontSize: 16,
  fontWeight: "800" as const
};

const typeHint = {
  color: "#dbeafe",
  fontSize: 12,
  marginTop: 4,
  textAlign: "center" as const
};

const rulesBox = {
  marginTop: 8,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.20)",
  borderRadius: 16,
  padding: 16,
  backgroundColor: "rgba(255,255,255,0.08)"
};

const rulesTitle = {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700" as const,
  marginBottom: 10
};

const ruleLine = {
  color: "#e5eefb",
  fontSize: 14,
  lineHeight: 22,
  marginBottom: 6
};

const btn = {
  backgroundColor: "#12b8a6",
  padding: 16,
  borderRadius: 14,
  marginTop: 20,
  alignItems: "center" as const
};

const btnDisabled = {
  opacity: 0.7
};

const btnText = {
  color: "#fff",
  fontWeight: "800" as const,
  fontSize: 16
};

const secondaryBtn = {
  backgroundColor: "rgba(47,95,147,0.96)",
  padding: 16,
  borderRadius: 14,
  marginTop: 12,
  alignItems: "center" as const
};

const secondaryBtnText = {
  color: "#fff",
  fontWeight: "800" as const,
  fontSize: 16
};

const row = {
  paddingRight: 10
};

const rowFields = {
  flexDirection: "row" as const,
  gap: 10
};

const card = {
  width: 100,
  height: 100,
  backgroundColor: "rgba(30,58,138,0.86)",
  marginRight: 10,
  borderRadius: 12,
  overflow: "hidden" as const,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.14)"
};

const cardInner = {
  flex: 1,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  padding: 8
};

const cardText = {
  color: "#fff",
  textAlign: "center" as const
};

const img = {
  width: 100,
  height: 100,
  borderRadius: 12
};

const mainBox = {
  height: 200,
  backgroundColor: "rgba(147,197,253,0.88)",
  borderRadius: 18,
  marginBottom: 12,
  overflow: "hidden" as const,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.20)"
};

const mainImg = {
  width: "100%" as const,
  height: 200
};

const mainPlaceholder = {
  flex: 1,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  paddingHorizontal: 20
};

const mainPlaceholderTitle = {
  color: "#083b74",
  fontWeight: "700" as const,
  fontSize: 16,
  marginBottom: 6
};

const mainPlaceholderSubtitle = {
  color: "#083b74",
  textAlign: "center" as const
};

const videoEmoji = {
  fontSize: 24,
  marginBottom: 4
};

const videoText = {
  color: "#fff",
  marginBottom: 8,
  textAlign: "center" as const
};

const removeBtn = {
  backgroundColor: "#dc2626",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8
};

const removeBtnText = {
  color: "#fff",
  fontSize: 12,
  fontWeight: "700" as const
};