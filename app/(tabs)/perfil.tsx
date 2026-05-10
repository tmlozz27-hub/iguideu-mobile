import React, { useCallback, useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { apiGet, apiPut } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";
const PROFILE_CACHE_KEY = "iguideu_profile_cache";

const copy = {
  es: {
    title: "Perfil de viajero",
    addPhoto: "Agregar foto",
    personalInfo: "Información personal",
    savedOk: "Perfil guardado correctamente",
    loading: "Cargando...",
    name: "Nombre",
    namePh: "Tu nombre",
    lastName: "Apellido",
    lastNamePh: "Tu apellido",
    country: "País de residencia",
    countryPh: "Tu país de residencia",
    city: "Ciudad",
    cityPh: "Tu ciudad",
    language: "Idioma principal",
    languagePh: "Tu idioma principal",
    phone: "Teléfono",
    phonePh: "Tu número de contacto",
    travelStyle: "Tipo de viaje",
    travelStylePh: "Relax, aventura, cultura, familia",
    interests: "Intereses",
    interestsPh: "Historia, gastronomía, naturaleza, arte",
    about: "Sobre vos",
    aboutPh: "Contá brevemente qué experiencia te gustaría vivir",
    saving: "Guardando...",
    saved: "✓ Perfil guardado",
    save: "Guardar",
    logout: "Cerrar sesión",
    updated: "Perfil actualizado",
    saveError: "No se pudo guardar",
  },
  en: {
    title: "Traveler profile",
    addPhoto: "Add photo",
    personalInfo: "Personal information",
    savedOk: "Profile saved successfully",
    loading: "Loading...",
    name: "First name",
    namePh: "Your first name",
    lastName: "Last name",
    lastNamePh: "Your last name",
    country: "Country of residence",
    countryPh: "Your country of residence",
    city: "City",
    cityPh: "Your city",
    language: "Main language",
    languagePh: "Your main language",
    phone: "Phone",
    phonePh: "Your contact number",
    travelStyle: "Travel style",
    travelStylePh: "Relax, adventure, culture, family",
    interests: "Interests",
    interestsPh: "History, food, nature, art",
    about: "About you",
    aboutPh: "Briefly describe the experience you would like to have",
    saving: "Saving...",
    saved: "✓ Profile saved",
    save: "Save",
    logout: "Log out",
    updated: "Profile updated",
    saveError: "Could not save",
  },
};

export default function ProfileScreen() {
  const router = useRouter();

  const [lang, setLang] = useState<"es" | "en">("es");
  const t = copy[lang];

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [phone, setPhone] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState("");
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function firstNonEmpty(...values: any[]) {
    for (const value of values) {
      const text = String(value ?? "").trim();
      if (text) return text;
    }
    return "";
  }

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const storedEmail = await AsyncStorage.getItem(USER_EMAIL_KEY);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const cachedRaw = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      const cached = cachedRaw ? JSON.parse(cachedRaw) : {};

      const data = await apiGet("/api/auth/me", headers);
      const u = data?.user || data || {};
      const profile = u?.travelerProfile || u?.profile || {};

      const finalEmail = firstNonEmpty(
        u?.email,
        data?.email,
        data?.user?.email,
        profile?.email,
        cached?.email,
        storedEmail
      );

      setUser({ ...u, email: finalEmail });

      setName(firstNonEmpty(u?.name, profile?.name, cached?.name));
      setLastName(firstNonEmpty(u?.lastName, profile?.lastName, profile?.surname, cached?.lastName));
      setCountry(firstNonEmpty(u?.country, profile?.country, cached?.country));
      setCity(firstNonEmpty(u?.city, profile?.city, cached?.city));
      setLanguage(firstNonEmpty(u?.language, u?.languages, profile?.language, profile?.languages, cached?.language));
      setPhone(firstNonEmpty(u?.phone, profile?.phone, cached?.phone));
      setTravelStyle(firstNonEmpty(u?.travelStyle, profile?.travelStyle, cached?.travelStyle));
      setInterests(firstNonEmpty(u?.interests, profile?.interests, cached?.interests));
      setAbout(firstNonEmpty(u?.about, u?.bio, profile?.about, profile?.bio, cached?.about));
      setPhoto(
        firstNonEmpty(
          u?.photo,
          u?.photoUrl,
          u?.avatarUrl,
          profile?.photo,
          profile?.photoUrl,
          profile?.avatarUrl,
          cached?.photo
        ) || null
      );
    } catch {
      const storedEmail = await AsyncStorage.getItem(USER_EMAIL_KEY);
      setUser({ email: storedEmail || "" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setSaved(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      const payload = {
        name: String(name || "").trim(),
        lastName: String(lastName || "").trim(),
        country: String(country || "").trim(),
        city: String(city || "").trim(),
        language: String(language || "").trim(),
        phone: String(phone || "").trim(),
        travelStyle: String(travelStyle || "").trim(),
        interests: String(interests || "").trim(),
        about: String(about || "").trim(),
        photo: photo || ""
      };

      await apiPut("/api/auth/me", payload, {
        Authorization: `Bearer ${token}`
      });

      await AsyncStorage.setItem(
        PROFILE_CACHE_KEY,
        JSON.stringify({
          ...payload,
          email: String(user?.email || "").trim().toLowerCase()
        })
      );

      await loadUser();
      setSaved(true);
      Alert.alert("OK", t.updated);
    } catch {
      Alert.alert("Error", t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_EMAIL_KEY, PROFILE_CACHE_KEY]);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingTop: 30, paddingHorizontal: 24, paddingBottom: 30 }}>
            <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
              <Pressable
                onPress={() => setLang(lang === "es" ? "en" : "es")}
                style={{
                  backgroundColor: "rgba(255,255,255,0.72)",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 18,
                }}
              >
                <Text style={{ color: "#173B6B", fontWeight: "900" }}>
                  {lang === "es" ? "ES" : "EN"}
                </Text>
              </Pressable>
            </View>

            <Text style={titleMain}>I GUIDE U</Text>
            <Text style={titleSub}>{t.title}</Text>

            <Pressable onPress={pickImage} style={photoBox}>
              {photo ? (
                <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={{ color: "#173B6B", fontWeight: "800", fontSize: 15 }}>
                  {t.addPhoto}
                </Text>
              )}
            </Pressable>
          </View>

          <View style={card}>
            <Text style={section}>{t.personalInfo}</Text>

            {saved ? (
              <View
                style={{
                  backgroundColor: "rgba(22,163,74,0.14)",
                  borderWidth: 1,
                  borderColor: "rgba(22,163,74,0.30)",
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  marginBottom: 16
                }}
              >
                <Text style={{ color: "#166534", fontSize: 15, fontWeight: "800" }}>
                  {t.savedOk}
                </Text>
              </View>
            ) : null}

            <Text style={label}>Email</Text>
            <Text style={emailText}>{loading ? t.loading : user?.email || "-"}</Text>

            <Text style={label}>{t.name}</Text>
            <TextInput value={name} onChangeText={(value) => { setName(value); setSaved(false); }} placeholder={t.namePh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.lastName}</Text>
            <TextInput value={lastName} onChangeText={(value) => { setLastName(value); setSaved(false); }} placeholder={t.lastNamePh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.country}</Text>
            <TextInput value={country} onChangeText={(value) => { setCountry(value); setSaved(false); }} placeholder={t.countryPh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.city}</Text>
            <TextInput value={city} onChangeText={(value) => { setCity(value); setSaved(false); }} placeholder={t.cityPh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.language}</Text>
            <TextInput value={language} onChangeText={(value) => { setLanguage(value); setSaved(false); }} placeholder={t.languagePh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.phone}</Text>
            <TextInput value={phone} onChangeText={(value) => { setPhone(value); setSaved(false); }} placeholder={t.phonePh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.travelStyle}</Text>
            <TextInput value={travelStyle} onChangeText={(value) => { setTravelStyle(value); setSaved(false); }} placeholder={t.travelStylePh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.interests}</Text>
            <TextInput value={interests} onChangeText={(value) => { setInterests(value); setSaved(false); }} placeholder={t.interestsPh} placeholderTextColor="#6b7280" style={input} />

            <Text style={label}>{t.about}</Text>
            <TextInput value={about} onChangeText={(value) => { setAbout(value); setSaved(false); }} placeholder={t.aboutPh} placeholderTextColor="#6b7280" multiline numberOfLines={4} textAlignVertical="top" style={[input, { minHeight: 120, paddingTop: 14 }]} />

            <Pressable onPress={handleSave} disabled={saving} style={[buttonPrimary, { backgroundColor: saving ? "#5a6b85" : saved ? "#16a34a" : "#173B6B" }]}>
              <Text style={buttonPrimaryText}>{saving ? t.saving : saved ? t.saved : t.save}</Text>
            </Pressable>

            <Pressable onPress={handleLogout} style={buttonDanger}>
              <Text style={buttonDangerText}>{t.logout}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const titleMain = { color: "#173B6B", fontSize: 36, fontWeight: "900" as const, textAlign: "center" as const };
const titleSub = { color: "#173B6B", fontSize: 26, fontWeight: "800" as const, textAlign: "center" as const, marginTop: 10, marginBottom: 20 };
const photoBox = { alignSelf: "center" as const, width: 180, height: 180, borderRadius: 90, overflow: "hidden" as const, backgroundColor: "rgba(255,255,255,0.25)", borderWidth: 3, borderColor: "#ffffff", justifyContent: "center" as const, alignItems: "center" as const };
const card = { backgroundColor: "rgba(255,255,255,0.20)", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" };
const section = { fontSize: 22, fontWeight: "800" as const, marginBottom: 18, color: "#173B6B" };
const label = { fontSize: 14, fontWeight: "700" as const, marginBottom: 6, color: "#374151" };
const emailText = { fontSize: 16, marginBottom: 16, color: "#111827" };
const input = { backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 16, padding: 14, marginBottom: 12, color: "#173B6B" };
const buttonPrimary = { padding: 16, borderRadius: 16, alignItems: "center" as const, marginTop: 12 };
const buttonPrimaryText = { color: "#ffffff", fontWeight: "800" as const, fontSize: 16 };
const buttonDanger = { backgroundColor: "#dc2626", padding: 16, borderRadius: 16, alignItems: "center" as const, marginTop: 12 };
const buttonDangerText = { color: "#ffffff", fontWeight: "800" as const, fontSize: 16 };