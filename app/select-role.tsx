import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    title: "Elegí tu perfil",
    traveler: "Viajero",
    guide: "Guía"
  },
  en: {
    title: "Choose your profile",
    traveler: "Traveler",
    guide: "Guide"
  }
};

export default function SelectRoleScreen() {
  const router = useRouter();
  const [lang, setLang] = useState<"es" | "en">("es");
  const t = copy[lang];

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((savedLang) => {
      if (savedLang === "es" || savedLang === "en") {
        setLang(savedLang);
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
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
            backgroundColor: "rgba(11,62,145,0.42)",
          }}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 80,
            paddingBottom: 40,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={{ alignItems: "center", marginBottom: 60 }}>
              <Text
                style={{
                  color: "#173B6B",
                  fontSize: 40,
                  fontWeight: "900",
                  textAlign: "center",
                  letterSpacing: 1.5,
                }}
              >
                I GUIDE U
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 34,
                  fontWeight: "800",
                  textAlign: "center",
                  marginTop: 26,
                }}
              >
                {t.title}
              </Text>
            </View>

            <View style={{ gap: 20 }}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/register",
                    params: { role: "traveler" },
                  })
                }
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  paddingVertical: 24,
                  borderRadius: 28,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.28)",
                }}
              >
                <Text
                  style={{
                    color: "#173B6B",
                    fontSize: 24,
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  {t.traveler}
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/register",
                    params: { role: "guide" },
                  })
                }
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  paddingVertical: 24,
                  borderRadius: 28,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.28)",
                }}
              >
                <Text
                  style={{
                    color: "#173B6B",
                    fontSize: 24,
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  {t.guide}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}