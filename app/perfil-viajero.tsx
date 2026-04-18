import React, { useEffect, useState } from "react";
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
import { apiGet, apiPut } from "@/config/api";

const TOKEN_KEY = "iguideu_token";

type PickedMedia = {
  uri: string;
};

export default function PerfilViajero() {
  const router = useRouter();

  const [mainPhoto, setMainPhoto] = useState<PickedMedia | null>(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState("");
  const [about, setAbout] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function firstNonEmpty(...values: any[]) {
    for (const value of values) {
      const text = String(value ?? "").trim();
      if (text) return text;
    }
    return "";
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const data = await apiGet("/api/auth/me", headers);
      const u = data?.user || data || {};
      const profile = u?.travelerProfile || u?.profile || {};

      setName(firstNonEmpty(u?.name, profile?.name));
      setLastName(firstNonEmpty(u?.lastName, profile?.lastName, profile?.surname));
      setEmail(firstNonEmpty(u?.email, profile?.email));
      setPhone(firstNonEmpty(u?.phone, profile?.phone));
      setCountry(firstNonEmpty(u?.country, profile?.country));
      setCity(firstNonEmpty(u?.city, profile?.city));
      setLanguage(firstNonEmpty(u?.language, u?.languages, profile?.language, profile?.languages));
      setTravelStyle(firstNonEmpty(u?.travelStyle, profile?.travelStyle));
      setInterests(firstNonEmpty(u?.interests, profile?.interests));
      setAbout(firstNonEmpty(u?.about, u?.bio, profile?.about, profile?.bio));

      const photoValue = firstNonEmpty(
        u?.photo,
        u?.photoUrl,
        u?.avatarUrl,
        profile?.photo,
        profile?.photoUrl,
        profile?.avatarUrl
      );

      if (photoValue) {
        setMainPhoto({ uri: photoValue });
      }
    } catch (error) {
      console.log("ERROR loadProfile perfil-viajero", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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

    if (!name.trim()) {
      return Alert.alert("Error", "Ingresá tu nombre");
    }

    if (!email.trim()) {
      return Alert.alert("Error", "Ingresá tu email");
    }

    if (!phone.trim()) {
      return Alert.alert("Error", "Ingresá tu teléfono");
    }

    if (!acceptTerms) {
      return Alert.alert("Error", "Debes aceptar los términos");
    }

    try {
      setSaving(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        Alert.alert("Error", "No hay sesión activa. Volvé a iniciar sesión.");
        return;
      }

      await apiPut(
        "/api/auth/me",
        {
          name: String(name || "").trim(),
          lastName: String(lastName || "").trim(),
          email: String(email || "").trim().toLowerCase(),
          phone: String(phone || "").trim(),
          country: String(country || "").trim(),
          city: String(city || "").trim(),
          language: String(language || "").trim(),
          travelStyle: String(travelStyle || "").trim(),
          interests: String(interests || "").trim(),
          about: String(about || "").trim(),
          photo: mainPhoto?.uri || ""
        },
        { Authorization: `Bearer ${token}` }
      );

      Alert.alert("Perfil listo", "Guardado correctamente", [
        { text: "OK", onPress: () => router.replace("/(tabs)/perfil") }
      ]);
    } catch (error: any) {
      console.log("ERROR handleSave perfil-viajero", error);
      Alert.alert("Error", error?.message || "No se pudo guardar el perfil");
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
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(183,209,245,0.55)"
          }}
        />

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
              editable={!loading && !saving}
            />

            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Apellido"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!loading && !saving}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              style={input}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading && !saving}
            />

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!loading && !saving}
            />

            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="País"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!loading && !saving}
            />

            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ciudad"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!loading && !saving}
            />

            <TextInput
              value={language}
              onChangeText={setLanguage}
              placeholder="Idioma"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!loading && !saving}
            />

            <TextInput
              value={travelStyle}
              onChangeText={setTravelStyle}
              placeholder="Tipo de viaje"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!loading && !saving}
            />

            <TextInput
              value={interests}
              onChangeText={setInterests}
              placeholder="Intereses"
              placeholderTextColor="#6b7280"
              style={input}
              editable={!loading && !saving}
            />

            <TextInput
              value={about}
              onChangeText={setAbout}
              placeholder="Sobre vos"
              placeholderTextColor="#6b7280"
              multiline
              textAlignVertical="top"
              style={[input, { minHeight: 100 }]}
              editable={!loading && !saving}
            />

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
                {acceptTerms ? <Text style={{ color: "#fff" }}>✓</Text> : null}
              </View>
              <Text style={{ color: "#173B6B", fontWeight: "600" }}>Acepto términos</Text>
            </Pressable>

            <Pressable onPress={handleSave} disabled={saving || loading} style={button}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {loading ? "Cargando..." : saving ? "Guardando..." : "GUARDAR PERFIL"}
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
  color: "#fff",
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
  borderColor: "#fff",
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
  marginBottom: 20,
  color: "#173B6B"
};

const input = {
  backgroundColor: "rgba(255,255,255,0.6)",
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
  color: "#173B6B"
};

const button = {
  backgroundColor: "#173B6B",
  padding: 16,
  borderRadius: 16,
  alignItems: "center" as const,
  marginTop: 12
};