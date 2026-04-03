import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { API_BASE } from "@/config/api";

export default function PerfilGuia() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [price24h, setPrice24h] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !city.trim() || !country.trim()) {
      Alert.alert("Faltan datos", "Completá nombre, email, teléfono, ciudad y país.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/guides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          city: city.trim(),
          country: country.trim(),
          bio: bio.trim(),
          languages: languages.trim(),
          priceHour: Number(priceHour) || 0,
          priceDay: Number(priceDay) || 0,
          price24h: Number(price24h) || 0,
          active: true
        })
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("RESPONSE NO JSON:", text);
        Alert.alert("Error servidor", "El backend no respondió JSON. Revisar endpoint.");
        return;
      }

      if (!res.ok || !data?.ok) {
        Alert.alert("Error", data?.error || "No se pudo guardar el perfil.");
        return;
      }

      Alert.alert("Perfil creado", "Tu perfil de guía ya está activo");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0d4d92" }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ color: "#fff", fontSize: 32, fontWeight: "800", textAlign: "center", marginBottom: 20 }}>
        Completar perfil de guía
      </Text>

      <TextInput placeholder="Nombre completo" value={name} onChangeText={setName} style={input} editable={!loading} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={input} editable={!loading} />
      <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} style={input} editable={!loading} />
      <TextInput placeholder="Ciudad" value={city} onChangeText={setCity} style={input} editable={!loading} />
      <TextInput placeholder="País" value={country} onChangeText={setCountry} style={input} editable={!loading} />
      <TextInput placeholder="Idiomas" value={languages} onChangeText={setLanguages} style={input} editable={!loading} />
      <TextInput placeholder="Bio" value={bio} onChangeText={setBio} style={[input, { height: 100 }]} multiline editable={!loading} />

      <Text style={label}>Tarifas</Text>
      <TextInput placeholder="Precio hora" value={priceHour} onChangeText={setPriceHour} style={input} editable={!loading} />
      <TextInput placeholder="Precio día" value={priceDay} onChangeText={setPriceDay} style={input} editable={!loading} />
      <TextInput placeholder="Precio 24h" value={price24h} onChangeText={setPrice24h} style={input} editable={!loading} />

      <Pressable onPress={handleSave} style={button} disabled={loading}>
        <Text style={{ color: "#fff", fontWeight: "800" }}>
          {loading ? "Guardando..." : "Aceptar"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const input = {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 14,
  marginBottom: 12
} as const;

const label = {
  color: "#fff",
  fontSize: 18,
  marginTop: 10,
  marginBottom: 10
} as const;

const button = {
  backgroundColor: "#12b8a6",
  padding: 18,
  borderRadius: 14,
  alignItems: "center",
  marginTop: 20
} as const;