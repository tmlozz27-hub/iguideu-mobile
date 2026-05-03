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

export default function ProfileScreen() {
  const router = useRouter();

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
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const cachedRaw = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      const cached = cachedRaw ? JSON.parse(cachedRaw) : {};

      const data = await apiGet("/api/auth/me", headers);
      const u = data?.user || data || {};
      const profile = u?.travelerProfile || u?.profile || {};

      // 🔥 ÚNICO CAMBIO
      const savedEmail = String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "").trim().toLowerCase();

      setUser({
        ...u,
        email: firstNonEmpty(u?.email, profile?.email, cached?.email, savedEmail)
      });

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
      setUser(null);
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
      Alert.alert("OK", "Perfil actualizado");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 30 }}>
            <Text style={titleMain}>I GUIDE U</Text>
            <Text style={titleSub}>Perfil de viajero</Text>

            <Pressable onPress={pickImage} style={photoBox}>
              {photo ? (
                <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={{ color: "#173B6B", fontWeight: "800", fontSize: 15 }}>
                  Agregar foto
                </Text>
              )}
            </Pressable>
          </View>

          <View style={card}>
            <Text style={section}>Información personal</Text>

            <Text style={label}>Email</Text>
            <Text style={emailText}>{loading ? "Cargando..." : user?.email || "-"}</Text>

            <Text style={label}>Nombre</Text>
            <TextInput value={name} onChangeText={setName} style={input} />

            <Text style={label}>Apellido</Text>
            <TextInput value={lastName} onChangeText={setLastName} style={input} />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const titleMain = { color:"#173B6B", fontSize:36, fontWeight:"900", textAlign:"center" };
const titleSub = { color:"#173B6B", fontSize:26, fontWeight:"800", textAlign:"center" };
const photoBox = { alignSelf:"center", width:180, height:180, borderRadius:90, overflow:"hidden", backgroundColor:"rgba(255,255,255,0.25)", borderWidth:3, borderColor:"#fff", justifyContent:"center", alignItems:"center" };
const card = { backgroundColor:"rgba(255,255,255,0.20)", borderTopLeftRadius:30, borderTopRightRadius:30, padding:22 };
const section = { fontSize:22, fontWeight:"800", marginBottom:18, color:"#173B6B" };
const label = { fontSize:14, fontWeight:"700", marginBottom:6 };
const emailText = { fontSize:16, marginBottom:16 };
const input = { backgroundColor:"#fff", borderRadius:16, padding:14, marginBottom:12 };