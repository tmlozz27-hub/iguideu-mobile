import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function PerfilGuia() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [price24h, setPrice24h] = useState("");

  const handleSave = () => {
    Alert.alert("Perfil creado", "Tu perfil de guía ya está activo");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0d4d92" }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ color: "#fff", fontSize: 32, fontWeight: "800", textAlign: "center", marginBottom: 20 }}>
        Completar perfil de guía
      </Text>

      <TextInput placeholder="Nombre completo" value={name} onChangeText={setName} style={input} />
      <TextInput placeholder="Ciudad" value={city} onChangeText={setCity} style={input} />
      <TextInput placeholder="País" value={country} onChangeText={setCountry} style={input} />
      <TextInput placeholder="Idiomas (ej: Español, Inglés)" value={languages} onChangeText={setLanguages} style={input} />
      <TextInput placeholder="Bio" value={bio} onChangeText={setBio} style={[input, { height: 100 }]} multiline />

      <Text style={label}>Tarifas</Text>
      <TextInput placeholder="Precio por hora USD" value={priceHour} onChangeText={setPriceHour} style={input} />
      <TextInput placeholder="Precio jornada 8h USD" value={priceDay} onChangeText={setPriceDay} style={input} />
      <TextInput placeholder="Precio 24h USD" value={price24h} onChangeText={setPrice24h} style={input} />

      <Text style={label}>Fotos (4) + Video 45s</Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <View style={media}><Text>Foto</Text></View>
        <View style={media}><Text>Foto</Text></View>
        <View style={media}><Text>Foto</Text></View>
        <View style={media}><Text>Foto</Text></View>
        <View style={[media, { backgroundColor: "#1d4ed8" }]}><Text style={{ color: "#fff" }}>Video</Text></View>
      </View>

      <Pressable onPress={handleSave} style={button}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>Aceptar</Text>
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

const media = {
  width: 60,
  height: 60,
  borderRadius: 10,
  backgroundColor: "#93c5fd",
  justifyContent: "center",
  alignItems: "center"
} as const;