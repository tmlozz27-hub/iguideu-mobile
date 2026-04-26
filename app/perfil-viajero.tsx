import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ImageBackground
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost, apiPut } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";
const PROFILE_CACHE_KEY = "iguideu_profile_cache";

type PickedMedia = {
  uri: string;
};

export default function PerfilViajero() {
  const router = useRouter();

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

    if (!cleanName) return Alert.alert("Error", "Ingresá tu nombre");
    if (!cleanEmail) return Alert.alert("Error", "Ingresá tu email");
    if (!cleanPhone) return Alert.alert("Error", "Ingresá tu teléfono");
    if (!acceptTerms) return Alert.alert("Error", "Debes aceptar los términos");
    if (!password.trim()) return Alert.alert("Error", "Ingresá una contraseña");
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Las contraseñas no coinciden");
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
        Alert.alert("Error", registerData?.message || "No se pudo crear la cuenta");
        return;
      }

      const loginData = await apiPost("/api/auth/login", {
        email: cleanEmail,
        password
      });

      const token = String(loginData?.token || "").trim();

      if (!token) {
        Alert.alert("Error", "No se pudo iniciar sesión automáticamente");
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_EMAIL_KEY, cleanEmail);

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

      Alert.alert("Perfil listo", "Guardado correctamente", [
        { text: "OK", onPress: () => router.replace("/(tabs)") }
      ]);
    } catch (error: any) {
      const msg = String(error?.message || "");
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("exists") ||
        msg.toLowerCase().includes("existe")
      ) {
        Alert.alert("Error", "Ese email ya está registrado");
      } else {
        Alert.alert("Error", msg || "No se pudo guardar el perfil");
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
          <View style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 34 }}>
            <Text style={titleMain}>I GUIDE U</Text>
            <Text style={titleSub}>Perfil de viajero</Text>

            <Pressable onPress={pickImage} style={photoBox}>
              {mainPhoto ? (
                <Image source={{ uri: mainPhoto.uri }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={{ color: "#173B6B", fontWeight: "800" }}>Agregar foto</Text>
              )}
            </Pressable>
          </View>

          <View style={card}>
            <Text style={section}>Información personal</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              keyboardType="email-address"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="País"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ciudad"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={language}
              onChangeText={setLanguage}
              placeholder="Idioma"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={travelStyle}
              onChangeText={setTravelStyle}
              placeholder="Tipo de viaje"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={interests}
              onChangeText={setInterests}
              placeholder="Intereses"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!saving}
            />
            <TextInput
              value={about}
              onChangeText={setAbout}
              placeholder="Sobre vos"
              placeholderTextColor="#6b7280"
              multiline
              style={[input, { minHeight: 100 }]}
              editable={!saving}
            />

            <View style={{ position: "relative" }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                style={[input, { paddingRight: 84 }]}
                editable={!saving}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 14, top: 14 }}
              >
                <Text style={{ color: "#173B6B", fontWeight: "800" }}>
                  {showPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <View style={{ position: "relative" }}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showConfirmPassword}
                style={[input, { paddingRight: 84 }]}
                editable={!saving}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: 14, top: 14 }}
              >
                <Text style={{ color: "#173B6B", fontWeight: "800" }}>
                  {showConfirmPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
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
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {acceptTerms && <Text style={{ color: "#fff" }}>✓</Text>}
              </View>
              <Text>Acepto términos</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={[button, saving ? { opacity: 0.7 } : null]}
              disabled={saving}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {saving ? "GUARDANDO..." : "GUARDAR PERFIL"}
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
  fontWeight: "900",
  textAlign: "center"
};

const titleSub = {
  color: "#fff",
  fontSize: 26,
  fontWeight: "800",
  textAlign: "center",
  marginTop: 10,
  marginBottom: 20
};

const photoBox = {
  alignSelf: "center",
  width: 180,
  height: 180,
  borderRadius: 90,
  overflow: "hidden",
  backgroundColor: "rgba(255,255,255,0.25)",
  borderWidth: 3,
  borderColor: "#fff",
  justifyContent: "center",
  alignItems: "center"
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
  fontWeight: "800",
  marginBottom: 20,
  color: "#173B6B"
};

const input = {
  backgroundColor: "rgba(255,255,255,0.6)",
  borderRadius: 16,
  padding: 14,
  marginBottom: 12
};

const button = {
  backgroundColor: "#173B6B",
  padding: 16,
  borderRadius: 16,
  alignItems: "center",
  marginTop: 12
};
