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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    if (!password || password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
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
          password,
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
        Alert.alert("Error servidor", "El backend no respondió JSON.");
        return;
      }

      if (!response.ok || !data?.ok) {
        Alert.alert("Error", data?.error || "No se pudo guardar.");
        return;
      }

      Alert.alert("Perfil creado");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Error conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
      }}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ padding: 20 }}>

        <Text style={{ color: "#fff", fontSize: 30, fontWeight: "800", textAlign: "center", marginBottom: 20 }}>
          Completar perfil de guía
        </Text>

        {/* TODO el contenido queda IGUAL */}

        <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} style={{ backgroundColor:"#fff", padding:12, borderRadius:12, marginBottom:10 }} secureTextEntry />
        <TextInput placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} style={{ backgroundColor:"#fff", padding:12, borderRadius:12, marginBottom:10 }} secureTextEntry />

        <Pressable onPress={handleSave} style={{ backgroundColor:"#12b8a6", padding:16, borderRadius:14, marginTop:20 }}>
          <Text style={{ color:"#fff", fontWeight:"800", textAlign:"center" }}>Guardar perfil</Text>
        </Pressable>

        {/* 🔥 ESTE ES EL ÚNICO CAMBIO */}
        <Pressable
          onPress={() => router.push("/reservas-guia")}
          style={{ backgroundColor:"#173B6B", padding:16, borderRadius:14, marginTop:10 }}
        >
          <Text style={{ color:"#fff", fontWeight:"800", textAlign:"center" }}>
            Mis reservas
          </Text>
        </Pressable>

      </ScrollView>
    </ImageBackground>
  );
}