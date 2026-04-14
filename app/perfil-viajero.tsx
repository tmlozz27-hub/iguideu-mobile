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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState("");
  const [about, setAbout] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Ingresá tu nombre");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Ingresá tu email");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Ingresá tu teléfono");
      return;
    }

    if (!acceptTerms) {
      Alert.alert("Error", "Debes aceptar los términos y condiciones");
      return;
    }

    Alert.alert(
      "Perfil listo",
      "Tu perfil de viajero fue guardado correctamente",
      [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)")
        }
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#A9C9F5" }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 34 }}>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: "800",
            textAlign: "center",
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
            <Text style={{ color: "#3B6EA8", fontWeight: "800" }}>
              Agregar foto
            </Text>
          )}
        </Pressable>
      </View>

      <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 22 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 20 }}>
          Información personal
        </Text>

        <TextInput value={name} onChangeText={setName} placeholder="Nombre" style={input} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={input}
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          style={input}
        />
        <TextInput value={country} onChangeText={setCountry} placeholder="País" style={input} />
        <TextInput value={city} onChangeText={setCity} placeholder="Ciudad" style={input} />
        <TextInput value={language} onChangeText={setLanguage} placeholder="Idioma" style={input} />
        <TextInput value={travelStyle} onChangeText={setTravelStyle} placeholder="Tipo de viaje" style={input} />
        <TextInput value={interests} onChangeText={setInterests} placeholder="Intereses" style={input} />

        <TextInput
          value={about}
          onChangeText={setAbout}
          placeholder="Sobre vos"
          multiline
          style={[input, { minHeight: 100 }]}
        />

        <Pressable
          onPress={() => setAcceptTerms((prev) => !prev)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            marginBottom: 8
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#4A8FDF",
              backgroundColor: acceptTerms ? "#4A8FDF" : "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10
            }}
          >
            {acceptTerms ? (
              <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>✓</Text>
            ) : null}
          </View>

          <Text style={{ color: "#162033", flex: 1 }}>
            Acepto los términos y condiciones
          </Text>
        </Pressable>

        <Pressable onPress={handleSave} style={button}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            GUARDAR PERFIL
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const input = {
  backgroundColor: "#F8FAFC",
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#D8E2EE"
};

const button = {
  backgroundColor: "#4A8FDF",
  padding: 16,
  borderRadius: 16,
  alignItems: "center" as const,
  marginTop: 10
};