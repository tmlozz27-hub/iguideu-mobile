import React, { useMemo, useState } from "react";
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
import { API_BASE } from "@/config/api";

type PickedMedia = {
  uri: string;
};

export default function PerfilGuia() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [galleryPhotos, setGalleryPhotos] = useState<PickedMedia[]>([]);
  const [video, setVideo] = useState<PickedMedia | null>(null);
  const [mainPhoto, setMainPhoto] = useState<PickedMedia | null>(null);

  const gallerySlots = useMemo(() => {
    return [0, 1, 2, 3].map((i) => galleryPhotos[i] || null);
  }, [galleryPhotos]);

  const pickImage = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"]
    });
    if (!r.canceled) return { uri: r.assets[0].uri };
    return null;
  };

  const pickVideo = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      videoMaxDuration: 45
    });
    if (!r.canceled) setVideo({ uri: r.assets[0].uri });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/guides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
          country,
          mediaDraft: {
            mainPhoto: mainPhoto ? { uri: mainPhoto.uri } : null,
            galleryPhotos: galleryPhotos.map((item) => ({ uri: item.uri })),
            video: video ? { uri: video.uri } : null
          }
        })
      });

      if (res.ok) {
        Alert.alert("Perfil creado", "Tu perfil de guía ya está activo");
      } else {
        Alert.alert("Error", "No se pudo guardar el perfil");
      }
    } catch {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0d4d92" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={title}>Completar perfil de guía</Text>

      <Pressable
        style={mainBox}
        onPress={async () => {
          const img = await pickImage();
          if (img) setMainPhoto(img);
        }}
      >
        {mainPhoto ? (
          <Image source={{ uri: mainPhoto.uri }} style={mainImg} />
        ) : (
          <View style={mainPlaceholder}>
            <Text style={mainPlaceholderText}>Foto principal</Text>
          </View>
        )}
      </Pressable>

      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={input} />
      <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} style={input} />
      <TextInput placeholder="Ciudad" value={city} onChangeText={setCity} style={input} />
      <TextInput placeholder="País" value={country} onChangeText={setCountry} style={input} />

      <Text style={section}>Fotos + Video</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={row}>
        {gallerySlots.map((item, i) => (
          <View key={i} style={card}>
            {item ? (
              <Image source={{ uri: item.uri }} style={img} />
            ) : (
              <Pressable
                onPress={async () => {
                  const picked = await pickImage();
                  if (picked) {
                    const copy = [...galleryPhotos];
                    copy[i] = picked;
                    setGalleryPhotos(copy);
                  }
                }}
                style={cardInner}
              >
                <Text style={cardText}>Foto {i + 1}</Text>
              </Pressable>
            )}
          </View>
        ))}

        <View style={card}>
          {video ? (
            <View style={cardInner}>
              <Text style={videoEmoji}>🎬</Text>
              <Text style={videoText}>Video</Text>
              <Pressable onPress={() => setVideo(null)} style={removeBtn}>
                <Text style={removeBtnText}>Quitar</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={pickVideo} style={cardInner}>
              <Text style={cardText}>Video</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <Pressable onPress={handleSave} style={btn}>
        <Text style={btnText}>Aceptar</Text>
      </Pressable>
    </ScrollView>
  );
}

const title = {
  color: "#fff",
  fontSize: 30,
  textAlign: "center" as const,
  marginBottom: 20
};

const input = {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 10,
  marginBottom: 10
};

const section = {
  color: "#fff",
  marginTop: 10,
  marginBottom: 10
};

const btn = {
  backgroundColor: "#12b8a6",
  padding: 16,
  borderRadius: 12,
  marginTop: 20,
  alignItems: "center" as const
};

const btnText = {
  color: "#fff",
  fontWeight: "800" as const
};

const row = {
  paddingRight: 10
};

const card = {
  width: 100,
  height: 100,
  backgroundColor: "#1e3a8a",
  marginRight: 10,
  borderRadius: 10,
  overflow: "hidden" as const
};

const cardInner = {
  flex: 1,
  justifyContent: "center" as const,
  alignItems: "center" as const
};

const cardText = {
  color: "#fff"
};

const img = {
  width: 100,
  height: 100,
  borderRadius: 10
};

const mainBox = {
  height: 200,
  backgroundColor: "#93c5fd",
  borderRadius: 16,
  marginBottom: 12,
  overflow: "hidden" as const
};

const mainImg = {
  width: 400,
  height: 200,
  borderRadius: 16
};

const mainPlaceholder = {
  flex: 1,
  justifyContent: "center" as const,
  alignItems: "center" as const
};

const mainPlaceholderText = {
  color: "#083b74",
  fontWeight: "700" as const,
  fontSize: 16
};

const videoEmoji = {
  fontSize: 24,
  marginBottom: 4
};

const videoText = {
  color: "#fff",
  marginBottom: 8
};

const removeBtn = {
  backgroundColor: "#dc2626",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8
};

const removeBtnText = {
  color: "#fff",
  fontSize: 12,
  fontWeight: "700" as const
};