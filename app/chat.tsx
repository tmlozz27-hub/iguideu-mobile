import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
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

    if (!token) {
      throw new Error("No hay sesión activa. Volvé a iniciar sesión.");
    }

    return {
      Authorization: `Bearer ${token}`
    };
  }

  async function loadMe() {
    const headers = await getAuthHeaders();
    const me = await apiGet("/api/auth/me", headers);
    const user = (me as any)?.user || me || {};

    const id = String(user?._id || user?.id || user?.userId || "").trim();
    const name = String(user?.name || user?.fullName || "").trim();
    const emailFromApi = String(user?.email || "").trim().toLowerCase();
    const emailFromStorage = String((await AsyncStorage.getItem(USER_EMAIL_KEY)) || "").trim().toLowerCase();

    setSenderId(id);
    setSenderName(name);
    setSenderEmail(emailFromApi || emailFromStorage || "");
    setSenderType("traveler");
  }

  async function loadMessages() {
    if (!bookingId) return;

    const data = await apiGet(`/api/chat/messages?bookingId=${bookingId}`);
    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.items)
        ? (data as any).items
        : [];

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
    } catch (error: any) {
      console.log("ERROR refreshChat()", error);
      Alert.alert("Error", error?.message || "No se pudo abrir el chat.");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    try {
      const clean = String(text || "").trim();

      if (!clean) return;
      if (!bookingId) {
        Alert.alert("Error", "Falta bookingId.");
        return;
      }
      if (!senderId) {
        Alert.alert("Error", "No se pudo identificar el remitente.");
        return;
      }

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
    } catch (error: any) {
      console.log("ERROR sendMessage()", error);
      Alert.alert("Error", error?.message || "No se pudo enviar el mensaje.");
    }
  }

  useEffect(() => {
    refreshChat();
  }, [bookingId]);

  const bottomGap = useMemo(() => {
    return Math.max(insets.bottom, 10) + 10;
  }, [insets.bottom]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 20}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item, index) => item._id || item.id || String(index)}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12
          }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const body =
              item.text ||
              item.message ||
              item.body ||
              item.content ||
              "";

            const mine =
              !!senderId &&
              String(item.senderId || "") === String(senderId);

            return (
              <View
                style={{
                  marginBottom: 10,
                  alignItems: mine ? "flex-end" : "flex-start"
                }}
              >
                <View
                  style={{
                    maxWidth: "82%",
                    borderRadius: 16,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    backgroundColor: mine ? "#111827" : "#f3f4f6"
                  }}
                >
                  <Text
                    style={{
                      color: mine ? "#ffffff" : "#111827",
                      fontSize: 16
                    }}
                  >
                    {body}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ paddingTop: 24 }}>
              <Text style={{ fontSize: 16, color: "#6b7280" }}>
                {loading ? "Cargando mensajes..." : "Todavía no hay mensajes."}
              </Text>
            </View>
          }
        />

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: bottomGap,
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            backgroundColor: "#ffffff"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Escribir mensaje..."
              placeholderTextColor="#9ca3af"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 22,
                paddingHorizontal: 18,
                paddingVertical: 14,
                backgroundColor: "#ffffff",
                fontSize: 16
              }}
            />

            <Pressable
              onPress={sendMessage}
              style={{
                marginLeft: 12,
                backgroundColor: "#000000",
                borderRadius: 22,
                paddingHorizontal: 20,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "700" }}>
                Enviar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}