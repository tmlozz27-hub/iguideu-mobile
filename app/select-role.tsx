import React from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectRoleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        

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
                Elegí tu perfil
              </Text>
            </View>

            <View style={{ gap: 20 }}>
              <Pressable
                onPress={() => router.push("/perfil-viajero")}
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
                  Viajero
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/perfil-guia")}
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
                  Guía
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
