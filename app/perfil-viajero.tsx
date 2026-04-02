import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";

export default function PerfilViajero() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  const handleSave = () => {
    Alert.alert("Perfil creado", "Tu perfil de viajero está listo");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A9C9F5", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 20 }}>
        Perfil de viajero
      </Text>

      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={input} />
      <TextInput placeholder="País" value={country} onChangeText={setCountry} style={input} />

      <Pressable onPress={handleSave} style={button}>
        <Text style={{ color: "#fff", fontWeight: "800" }}>Guardar</Text>
      </Pressable>
    </View>
  );
}

const input = {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 14,
  marginBottom: 12
} as const;

const button = {
  backgroundColor: "#4A8FDF",
  padding: 16,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10
} as const;