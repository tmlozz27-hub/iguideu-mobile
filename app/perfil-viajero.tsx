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
    if (!name.trim()) return Alert.alert("Error", "Ingresá tu nombre");
    if (!email.trim()) return Alert.alert("Error", "Ingresá tu email");
    if (!phone.trim()) return Alert.alert("Error", "Ingresá tu teléfono");
    if (!acceptTerms) return Alert.alert("Error", "Debes aceptar los términos");
    if (!password.trim()) return Alert.alert("Error", "Ingresá una contraseña");
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Las contraseñas no coinciden");
    }

    Alert.alert("Perfil listo", "Guardado correctamente", [
      { text: "OK", onPress: () => router.replace("/(tabs)") }
    ]);
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
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              keyboardType="email-address"
              style={input}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono"
              placeholderTextColor="#6b7280"
              style={input}
            />
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="País"
              placeholderTextColor="#6b7280"
              style={input}
            />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ciudad"
              placeholderTextColor="#6b7280"
              style={input}
            />
            <TextInput
              value={language}
              onChangeText={setLanguage}
              placeholder="Idioma"
              placeholderTextColor="#6b7280"
              style={input}
            />
            <TextInput
              value={travelStyle}
              onChangeText={setTravelStyle}
              placeholder="Tipo de viaje"
              placeholderTextColor="#6b7280"
              style={input}
            />
            <TextInput
              value={interests}
              onChangeText={setInterests}
              placeholder="Intereses"
              placeholderTextColor="#6b7280"
              style={input}
            />
            <TextInput
              value={about}
              onChangeText={setAbout}
              placeholder="Sobre vos"
              placeholderTextColor="#6b7280"
              multiline
              style={[input, { minHeight: 100 }]}
            />

            <View style={{ position: "relative" }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                style={[input, { paddingRight: 84 }]}
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

            <Pressable onPress={handleSave} style={button}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>GUARDAR PERFIL</Text>
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