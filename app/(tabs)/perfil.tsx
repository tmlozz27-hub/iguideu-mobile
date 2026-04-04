import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { apiGet, apiPut } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

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

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = { Authorization: `Bearer ${token}` };

      const data = await apiGet("/api/auth/me", headers);
      const u = data?.user || data;

      setUser(u);
      setName(u?.name || "");
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      await apiPut(
        "/api/auth/me",
        { name },
        { Authorization: `Bearer ${token}` }
      );

      Alert.alert("OK", "Perfil actualizado");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_EMAIL_KEY]);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#A9C9F5" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: 24, paddingTop: 40 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#fff",
              textAlign: "center",
              marginBottom: 10
            }}
          >
            I GUIDE U
          </Text>

          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: "#fff",
              textAlign: "center",
              marginBottom: 20
            }}
          >
            Perfil de viajero
          </Text>

          <Pressable
            onPress={pickImage}
            style={{
              alignSelf: "center",
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "#dbeafe",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "#fff",
              overflow: "hidden"
            }}
          >
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={{ color: "#2563eb", fontWeight: "700" }}>
                Agregar foto
              </Text>
            )}
          </Pressable>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20
          }}
        >
          <Text style={label}>Email</Text>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>
            {loading ? "Cargando..." : user?.email || "-"}
          </Text>

          <Text style={label}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>Apellido</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Tu apellido"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>País de residencia</Text>
          <TextInput
            value={country}
            onChangeText={setCountry}
            placeholder="Tu país de residencia"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>Ciudad</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Tu ciudad"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>Idioma principal</Text>
          <TextInput
            value={language}
            onChangeText={setLanguage}
            placeholder="Tu idioma principal"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>Teléfono</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Tu número de contacto"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>Tipo de viaje</Text>
          <TextInput
            value={travelStyle}
            onChangeText={setTravelStyle}
            placeholder="Relax, aventura, cultura, familia"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>Intereses</Text>
          <TextInput
            value={interests}
            onChangeText={setInterests}
            placeholder="Historia, gastronomía, naturaleza, arte"
            placeholderTextColor="#6b7280"
            style={input}
          />

          <Text style={label}>Sobre vos</Text>
          <TextInput
            value={about}
            onChangeText={setAbout}
            placeholder="Contá brevemente qué experiencia te gustaría vivir"
            placeholderTextColor="#6b7280"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[input, { minHeight: 110, paddingTop: 14 }]}
          />

          <Pressable
            onPress={handleSave}
            style={{
              backgroundColor: "#2563eb",
              padding: 16,
              borderRadius: 14,
              alignItems: "center",
              marginTop: 10
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>
              {saving ? "Guardando..." : "Guardar"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              padding: 16,
              borderRadius: 14,
              alignItems: "center",
              marginTop: 10
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const label = {
  fontSize: 14,
  fontWeight: "700" as const,
  marginBottom: 6,
  color: "#374151"
};

const input = {
  backgroundColor: "#f9fafb",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 14,
  padding: 14,
  fontSize: 16,
  marginBottom: 12
};