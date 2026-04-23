import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "@/config/api";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

const GOOGLE_WEB_CLIENT_ID =
  "1029517266976-b0ag2bt7u88hj3sb39ffc67umpa83veb.apps.googleusercontent.com";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((token) => {
      if (token) router.replace("/(tabs)");
    });
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      Alert.alert("Google", "Login OK");
    } else if (response?.type === "error") {
      Alert.alert("Google", "Error Google");
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await apiPost("/api/auth/login", {
        email,
        password,
      });

      if (!data?.token) {
        Alert.alert("Error", "Credenciales incorrectas");
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_EMAIL_KEY, email);

      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!request) {
        Alert.alert("Google", "No listo");
        return;
      }
      await promptAsync();
    } catch {
      Alert.alert("Google", "No abre");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        }}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
          <Text style={{ fontSize: 30, textAlign: "center", marginBottom: 20 }}>
            I GUIDE U
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ backgroundColor: "#fff", marginBottom: 10, padding: 10 }}
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ backgroundColor: "#fff", marginBottom: 10, padding: 10 }}
          />

          <Pressable
            onPress={handleLogin}
            style={{ backgroundColor: "#173B6B", padding: 12 }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              {loading ? "..." : "Login"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleGoogleLogin}
            style={{ backgroundColor: "#fff", padding: 12, marginTop: 10 }}
          >
            <Text style={{ textAlign: "center" }}>
              Continuar con Google
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}