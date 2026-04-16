import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  ImageBackground
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet, apiPost } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";

type ChatMessage = {
  _id?: string;
  id?: string;
  text?: string;
  message?: string;
  body?: string;
  content?: string;
  senderId?: string;
  senderName?: string;
  senderEmail?: string;
  senderType?: string;
  createdAt?: string;
};

export default function ChatScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [senderId, setSenderId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderType, setSenderType] = useState("traveler");

  async function getAuthHeaders() {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("No hay sesión activa.");
    return { Authorization: `Bearer ${token}` };
  }

  async function loadMe() {
    const headers = await getAuthHeaders();
    const me = await apiGet("/api/auth/me", headers);
    const user = (me as any)?.user || me || {};

    setSenderId(String(user?._id || user?.id || "").trim());
    setSenderName(String(user?.name || "").trim());
    setSenderEmail(String(user?.email || "").trim());
    setSenderType("traveler");
  }

  async function loadMessages() {
    if (!bookingId) return;

    const data = await apiGet(`/api/chat/messages?bookingId=${bookingId}`);
    const list = Array.isArray(data) ? data : (data as any)?.items || [];

    setMessages(list);

    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }

  async function refreshChat() {
    try {
      setLoading(true);
      await loadMe();
      await loadMessages();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Error chat");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const clean = text.trim();
    if (!clean || !bookingId || !senderId) return;

    try {
      await apiPost("/api/chat/messages", {
        bookingId,
        senderId,
        senderName,
        senderEmail,
        senderType,
        text: clean
      });

      setText("");
      await loadMessages();

      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "No se pudo enviar");
    }
  }

  useEffect(() => {
    refreshChat();
  }, [bookingId]);

  const bottomGap = useMemo(() => {
    return Math.max(insets.bottom, 10) + 12;
  }, [insets.bottom]);

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80"
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Overlay azul */}
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(11,62,145,0.70)"
      }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item, i) => item._id || item.id || String(i)}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 20
          }}
          renderItem={({ item }) => {
            const body =
              item.text || item.message || item.body || item.content || "";

            const mine = String(item.senderId) === String(senderId);

            return (
              <View style={{
                marginBottom: 10,
                alignItems: mine ? "flex-end" : "flex-start"
              }}>
                <View style={{
                  maxWidth: "80%",
                  borderRadius: 18,
                  padding: 14,
                  backgroundColor: mine
                    ? "#12b8a6"
                    : "rgba(255,255,255,0.15)",
                  borderWidth: 1,
                  borderColor: mine
                    ? "#12b8a6"
                    : "rgba(255,255,255,0.2)"
                }}>
                  <Text style={{
                    color: "#fff",
                    fontSize: 16
                  }}>
                    {body}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
              {loading ? "Cargando..." : "No hay mensajes"}
            </Text>
          }
        />

        <View style={{
          paddingHorizontal: 14,
          paddingBottom: bottomGap,
          paddingTop: 8
        }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: 24,
            paddingHorizontal: 10,
            paddingVertical: 6
          }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Escribir mensaje..."
              placeholderTextColor="#d1d5db"
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 16,
                paddingHorizontal: 10,
                paddingVertical: 10
              }}
            />

            <Pressable
              onPress={sendMessage}
              style={{
                backgroundColor: "#12b8a6",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10
              }}
            >
              <Text style={{
                color: "#fff",
                fontWeight: "800"
              }}>
                Enviar
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}