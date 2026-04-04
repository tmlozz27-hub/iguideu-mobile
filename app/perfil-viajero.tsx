import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

type PickedMedia = {
  uri: string;
};

export default function PerfilViajero() {
  const router = useRouter();

  const [mainPhoto, setMainPhoto] = useState<PickedMedia | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState("");
  const [about, setAbout] = useState("");

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

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Ingresá tu nombre");
      return;
    }

    Alert.alert("Perfil listo", "Tu perfil de viajero fue guardado correctamente", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)")
      }
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#A9C9F5" }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          paddingTop: 48,
          paddingHorizontal: 24,
          paddingBottom: 34,
          backgroundColor: "#A9C9F5"
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: "800",
            textAlign: "center",
            letterSpacing: 1,
            marginBottom: 10
          }}
        >
          I GUIDE U
        </Text>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 24
          }}
        >
          Perfil de viajero
        </Text>

        <Pressable
          onPress={pickImage}
          style={{
            alignSelf: "center",
            width: 180,
            height: 180,
            borderRadius: 90,
            overflow: "hidden",
            backgroundColor: "#DCEBFF",
            borderWidth: 4,
            borderColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 18
          }}
        >
          {mainPhoto ? (
            <Image source={{ uri: mainPhoto.uri }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20
              }}
            >
              <Text
                style={{
                  color: "#3B6EA8",
                  fontSize: 17,
                  fontWeight: "800",
                  textAlign: "center",
                  marginBottom: 6
                }}
              >
                Agregar foto
              </Text>
              <Text
                style={{
                  color: "#5E7FA6",
                  fontSize: 13,
                  textAlign: "center"
                }}
              >
                Imagen principal del viajero
              </Text>
            </View>
          )}
        </Pressable>

        <Text
          style={{
            color: "#EAF4FF",
            fontSize: 15,
            textAlign: "center",
            lineHeight: 22,
            paddingHorizontal: 8
          }}
        >
          Un perfil claro y simple ayuda a generar más confianza con tu guía.
        </Text>
      </View>

      <View
        style={{
          marginTop: -10,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 22,
          paddingTop: 26,
          paddingBottom: 34
        }}
      >
        <Text
          style={{
            color: "#0F172A",
            fontSize: 22,
            fontWeight: "800",
            marginBottom: 20
          }}
        >
          Información personal
        </Text>

        <Text style={label}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          placeholderTextColor="#6B7280"
          style={input}
        />

        <Text style={label}>País</Text>
        <TextInput
          value={country}
          onChangeText={setCountry}
          placeholder="Tu país"
          placeholderTextColor="#6B7280"
          style={input}
        />

        <Text style={label}>Ciudad</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Tu ciudad"
          placeholderTextColor="#6B7280"
          style={input}
        />

        <Text style={label}>Idioma principal</Text>
        <TextInput
          value={language}
          onChangeText={setLanguage}
          placeholder="Ej: Español, English"
          placeholderTextColor="#6B7280"
          style={input}
        />

        <Text style={label}>Tipo de viaje</Text>
        <TextInput
          value={travelStyle}
          onChangeText={setTravelStyle}
          placeholder="Ej: relax, cultural, aventura, familia"
          placeholderTextColor="#6B7280"
          style={input}
        />

        <Text style={label}>Intereses</Text>
        <TextInput
          value={interests}
          onChangeText={setInterests}
          placeholder="Ej: historia, comida, arte, naturaleza"
          placeholderTextColor="#6B7280"
          style={input}
        />

        <Text style={label}>Sobre vos</Text>
        <TextInput
          value={about}
          onChangeText={setAbout}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Contá brevemente qué experiencias te gustan"
          placeholderTextColor="#6B7280"
          style={[input, { minHeight: 120, paddingTop: 14 }]}
        />

        <Pressable
          onPress={handleSave}
          style={{
            backgroundColor: "#4A8FDF",
            paddingVertical: 18,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "800"
            }}
          >
            GUARDAR PERFIL
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const label = {
  color: "#0F172A",
  fontSize: 15,
  fontWeight: "700" as const,
  marginBottom: 8,
  marginTop: 4
};

const input = {
  backgroundColor: "#F8FAFC",
  borderRadius: 16,
  paddingHorizontal: 16,
  paddingVertical: 15,
  fontSize: 16,
  color: "#111827",
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "#D8E2EE"
};