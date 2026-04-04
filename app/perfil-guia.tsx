import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE } from "@/config/api";

type PickedMedia = {
  uri: string;
};

export default function PerfilGuia() {
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

  const gallerySlots = useMemo(() => {
    return [0, 1, 2, 3].map((i) => galleryPhotos[i] || null);
  }, [galleryPhotos]);

  const pickImage = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8
    });
    if (!r.canceled) return { uri: r.assets[0].uri };
    return null;
  };

  const pickVideo = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      videoMaxDuration: 45
    });
    if (!r.canceled) setVideo({ uri: r.assets[0].uri });
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

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/guides`, {
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

      const text = await res.text();

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert("Error servidor", "El backend no respondió JSON. Revisar endpoint.");
        return;
      }

      if (!res.ok || !data?.ok) {
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
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0d4d92" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
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

      <TextInput
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
        style={input}
        editable={!loading}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={input}
        editable={!loading}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        style={input}
        editable={!loading}
      />

      <View style={rowFields}>
        <TextInput
          placeholder="Ciudad"
          value={city}
          onChangeText={setCity}
          style={[input, halfInput]}
          editable={!loading}
        />
        <TextInput
          placeholder="País"
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
        value={languages}
        onChangeText={setLanguages}
        style={input}
        editable={!loading}
      />

      <TextInput
        placeholder="Bio"
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
        value={priceHour}
        onChangeText={setPriceHour}
        style={input}
        editable={!loading}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Precio jornada"
        value={priceDay}
        onChangeText={setPriceDay}
        style={input}
        editable={!loading}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Precio 24h"
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

      <Pressable onPress={handleSave} style={[btn, loading ? btnDisabled : null]} disabled={loading}>
        <Text style={btnText}>{loading ? "Guardando..." : "Aceptar"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const title = {
  color: "#fff",
  fontSize: 30,
  fontWeight: "800" as const,
  textAlign: "center" as const,
  marginBottom: 20
};

const input = {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 10,
  marginBottom: 10
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
  backgroundColor: "rgba(255,255,255,0.10)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.18)",
  borderRadius: 12,
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
  borderRadius: 12,
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
  backgroundColor: "#1e3a8a",
  marginRight: 10,
  borderRadius: 10,
  overflow: "hidden" as const
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
  borderRadius: 10
};

const mainBox = {
  height: 200,
  backgroundColor: "#93c5fd",
  borderRadius: 16,
  marginBottom: 12,
  overflow: "hidden" as const
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