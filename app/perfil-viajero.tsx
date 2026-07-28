import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ImageBackground,
  Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost, apiPut } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";
const PROFILE_CACHE_KEY = "iguideu_profile_cache";
const USER_ROLE_KEY = "iguideu_user_role";
const LANG_KEY = "iguideu_lang";

type PickedMedia = {
  uri: string;
};

export default function PerfilViajero() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [mainPhoto, setMainPhoto] = useState<PickedMedia | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState("");
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");

  useEffect(() => {
    const loadLang = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANG_KEY);
        if (savedLang === "en" || savedLang === "es") {
          setLang(savedLang);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadLang();
  }, []);

  const t = {
    back: lang === "en" ? "Back" : "Volver",
    profileTitle: lang === "en" ? "Traveler profile" : "Perfil de viajero",
    addPhoto: lang === "en" ? "Add photo" : "Agregar foto",
    personalInfo: lang === "en" ? "Personal information" : "Información personal",
    placeholderName: lang === "en" ? "Name" : "Nombre",
    placeholderEmail: lang === "en" ? "Email" : "Email",
    placeholderPhone: lang === "en" ? "Phone" : "Teléfono",
    placeholderCountry: lang === "en" ? "Country" : "País",
    placeholderCity: lang === "en" ? "City" : "Ciudad",
    placeholderLanguage: lang === "en" ? "Language" : "Idioma",
    placeholderTravelStyle: lang === "en" ? "Travel style" : "Tipo de viaje",
    placeholderInterests: lang === "en" ? "Interests" : "Intereses",
    placeholderAbout: lang === "en" ? "About you" : "Sobre vos",
    placeholderPassword: lang === "en" ? "Password" : "Contraseña",
    placeholderConfirmPassword: lang === "en" ? "Confirm password" : "Confirmar contraseña",
    hide: lang === "en" ? "Hide" : "Ocultar",
    show: lang === "en" ? "Show" : "Ver",
    accept: lang === "en" ? "I accept the terms" : "Acepto términos",
    savingBtn: lang === "en" ? "SAVING..." : "GUARDANDO...",
    saveBtn: lang === "en" ? "SAVE PROFILE" : "GUARDAR PERFIL",
    alertErr: lang === "en" ? "Error" : "Error",
    alertName: lang === "en" ? "Please enter your name" : "Ingresá tu nombre",
    alertEmail: lang === "en" ? "Please enter your email" : "Ingresá tu email",
    alertInvalidEmail: lang === "en" ? "Please enter a valid email" : "Ingresá un email válido",
    alertPhone: lang === "en" ? "Please enter your phone number" : "Ingresá tu teléfono",
    alertTerms: lang === "en" ? "You must accept the terms" : "Debes aceptar los términos",
    alertPass: lang === "en" ? "Please enter a password" : "Ingresá una contraseña",
    alertMatch: lang === "en" ? "Passwords do not match" : "Las contraseñas no coinciden",
    alertCreateErr: lang === "en" ? "Could not create account" : "No se pudo crear la cuenta",
    alertLoginErr: lang === "en" ? "Could not log in automatically" : "No se pudo iniciar sesión automáticamente",
    alertSuccessTitle: lang === "en" ? "Profile ready" : "Perfil listo",
    alertSuccessMsg: lang === "en" ? "Saved successfully" : "Guardado correctamente",
    alertExists: lang === "en" ? "That email is already registered" : "Ese email ya está registrado",
    alertSaveErr: lang === "en" ? "Could not save profile" : "No se pudo guardar el perfil"
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9
    });

    if (!result.canceled) {
      setMainPhoto({ uri: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (saving) return;

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = String(phone || "").trim();
    const cleanCountry = String(country || "").trim();
    const cleanCity = String(city || "").trim();
    const cleanLanguage = String(language || "").trim();
    const cleanTravelStyle = String(travelStyle || "").trim();
    const cleanInterests = String(interests || "").trim();
    const cleanAbout = String(about || "").trim();
    const cleanPhoto = mainPhoto?.uri || "";

    if (!cleanName) return Alert.alert(t.alertErr, t.alertName);
    
    // --- VALIDACIÓN DE EMAIL MODIFICADA ---
    if (!cleanEmail) return Alert.alert(t.alertErr, t.alertEmail);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return Alert.alert(t.alertErr, t.alertInvalidEmail);
    }
    // --------------------------------------

    if (!cleanPhone) return Alert.alert(t.alertErr, t.alertPhone);
    if (!acceptTerms) return Alert.alert(t.alertErr, t.alertTerms);
    if (!password.trim()) return Alert.alert(t.alertErr, t.alertPass);

    if (password !== confirmPassword) {
      return Alert.alert(t.alertErr, t.alertMatch);
    }

    try {
      setSaving(true);

      const registerData = await apiPost("/api/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password,
        role: "traveler"
      });

      if (!registerData?.ok) {
        Alert.alert(t.alertErr, registerData?.message || t.alertCreateErr);
        return;
      }

      const loginData = await apiPost("/api/auth/login", {
        email: cleanEmail,
        password
      });

      const token = String(loginData?.token || "").trim();

      if (!token) {
        Alert.alert(t.alertErr, t.alertLoginErr);
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_EMAIL_KEY, cleanEmail);
      await AsyncStorage.setItem(USER_ROLE_KEY, "traveler");

      const profilePayload = {
        name: cleanName,
        phone: cleanPhone,
        country: cleanCountry,
        city: cleanCity,
        language: cleanLanguage,
        travelStyle: cleanTravelStyle,
        interests: cleanInterests,
        about: cleanAbout,
        photo: cleanPhoto
      };

      await apiPut("/api/auth/me", profilePayload, {
        Authorization: `Bearer ${token}`
      });

      await AsyncStorage.setItem(
        PROFILE_CACHE_KEY,
        JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          country: cleanCountry,
          city: cleanCity,
          language: cleanLanguage,
          travelStyle: cleanTravelStyle,
          interests: cleanInterests,
          about: cleanAbout,
          photo: cleanPhoto
        })
      );

      Alert.alert(t.alertSuccessTitle, t.alertSuccessMsg, [
        { text: "OK", onPress: () => router.replace("/(tabs)") }
      ]);
    } catch (error: any) {
      const msg = String(error?.message || "");

      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("exists") ||
        msg.toLowerCase().includes("existe")
      ) {
        Alert.alert(t.alertErr, t.alertExists);
      } else {
        Alert.alert(t.alertErr, msg || t.alertSaveErr);
      }
    } finally {
      setSaving(false);
    }
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
            {Platform.OS === "ios" && (
              <View
                style={{
                  alignItems: "flex-start",
                  marginTop: Math.max(insets.top - 18, 0),
                  marginBottom: 16
                }}
              >
                <Pressable
                  onPress={() => router.back()}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.14)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.20)",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 999
                  }}
                >
                  <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>{t.back}</Text>
                </Pressable>
              </View>
            )}

            <Text style={titleMain}>I GUIDE U</Text>
            <Text style={titleSub}>{t.profileTitle}</Text>

            <Pressable onPress={pickImage} style={photoBox}>
              {mainPhoto ? (
                <Image source={{ uri: mainPhoto.uri }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={{ color: "#173B6B", fontWeight: "800", fontSize: 15 }}>
                  {t.addPhoto}
                </Text>
              )}
            </Pressable>
          </View>

          <View style={card}>
            <Text style={section}>{t.personalInfo}</Text>

            <Text style={label}>{t.placeholderEmail}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t.placeholderEmail}
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              keyboardType="email-address"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderName}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.placeholderName}
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderCountry}</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder={t.placeholderCountry}
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderCity}</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder={t.placeholderCity}
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderLanguage}</Text>
            <TextInput
              value={language}
              onChangeText={setLanguage}
              placeholder={t.placeholderLanguage}
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderPhone}</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={t.placeholderPhone}
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderTravelStyle}</Text>
            <TextInput
              value={travelStyle}
              onChangeText={setTravelStyle}
              placeholder={t.placeholderTravelStyle}
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderInterests}</Text>
            <TextInput
              value={interests}
              onChangeText={setInterests}
              placeholder={t.placeholderInterests}
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderAbout}</Text>
            <TextInput
              value={about}
              onChangeText={setAbout}
              placeholder={t.placeholderAbout}
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={[input, { minHeight: 120, paddingTop: 14 }]}
              editable={!saving}
            />

            <Text style={label}>{t.placeholderPassword}</Text>
            <View style={{ position: "relative" as const }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t.placeholderPassword}
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                style={[input, { paddingRight: 84 }]}
                editable={!saving}
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute" as const, right: 14, top: 14 }}
              >
                <Text style={{ color: "#173B6B", fontWeight: "800" as const }}>
                  {showPassword ? t.hide : t.show}
                </Text>
              </Pressable>
            </View>

            <Text style={label}>{t.placeholderConfirmPassword}</Text>
            <View style={{ position: "relative" as const }}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t.placeholderConfirmPassword}
                placeholderTextColor="#6b7280"
                secureTextEntry={!showConfirmPassword}
                style={[input, { paddingRight: 84 }]}
                editable={!saving}
              />

              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute" as const, right: 14, top: 14 }}
              >
                <Text style={{ color: "#173B6B", fontWeight: "800" as const }}>
                  {showConfirmPassword ? t.hide : t.show}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={{
                flexDirection: "row" as const,
                alignItems: "center" as const,
                marginTop: 8
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#4A8FDF",
                  backgroundColor: acceptTerms ? "#4A8FDF" : "transparent",
                  marginRight: 10,
                  justifyContent: "center" as const,
                  alignItems: "center" as const
                }}
              >
                {acceptTerms && <Text style={{ color: "#fff" }}>✓</Text>}
              </View>

              <Text style={{ color: "#111827", flex: 1 }}>{t.accept}</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={[buttonPrimary, { backgroundColor: saving ? "#5a6b85" : "#173B6B" }]}
              disabled={saving}
            >
              <Text style={buttonPrimaryText}>
                {saving ? t.savingBtn : t.saveBtn}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const titleMain = {
  color: "#173B6B",
  fontSize: 36,
  fontWeight: "900" as const,
  textAlign: "center" as const
};

const titleSub = {
  color: "#173B6B",
  fontSize: 26,
  fontWeight: "800" as const,
  textAlign: "center" as const,
  marginTop: 10,
  marginBottom: 20
};

const photoBox = {
  alignSelf: "center" as const,
  width: 180,
  height: 180,
  borderRadius: 90,
  overflow: "hidden" as const,
  backgroundColor: "rgba(255,255,255,0.25)",
  borderWidth: 3,
  borderColor: "#ffffff",
  justifyContent: "center" as const,
  alignItems: "center" as const
};

const card = {
  backgroundColor: "rgba(255,255,255,0.20)",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  padding: 22,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.25)"
};

const section = {
  fontSize: 22,
  fontWeight: "800" as const,
  marginBottom: 18,
  color: "#173B6B"
};

const label = {
  fontSize: 14,
  fontWeight: "700" as const,
  marginBottom: 6,
  color: "#374151"
};

const input = {
  backgroundColor: "rgba(255,255,255,0.6)",
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
  color: "#173B6B"
};

const buttonPrimary = {
  padding: 16,
  borderRadius: 16,
  alignItems: "center" as const,
  marginTop: 12
};

const buttonPrimaryText = {
  color: "#ffffff",
  fontWeight: "800" as const,
  fontSize: 16
};
