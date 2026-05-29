import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet, apiPost } from "@/config/api";

const TOKEN_KEY = "iguideu_token";
const USER_EMAIL_KEY = "iguideu_user_email";
const LANG_KEY = "iguideu_lang";

const copy = {
  es: {
    traveler: "Viajero",
    error: "Error",
    chatError: "Error chat",
    missingBooking: "Falta bookingId del chat.",
    sendError: "No se pudo enviar",
    loading: "Cargando...",
    empty: "No hay mensajes",
    placeholder: "Escribir mensaje...",
    send: "Enviar",
    back: "Volver"
  },
  en: {
    traveler: "Traveler",
    error: "Error",
    chatError: "Chat error",
    missingBooking: "Missing chat bookingId.",
    sendError: "Message could not be sent",
    loading: "Loading...",
    empty: "No messages yet",
    placeholder: "Write a message...",
    send: "Send",
    back: "Back"
  }
};

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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [senderId, setSenderId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderType] = useState("traveler");
  const [lang, setLang] = useState<"es" | "en">("es");

  const t = copy[lang];

  const loadLang = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);

    if (savedLang === "es" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  async function loadMe() {
    const savedEmail = String(
      (await AsyncStorage.getItem(USER_EMAIL_KEY)) || ""
    )
      .trim()
      .toLowerCase();

    try {
      const me = await apiGet("/api/auth/me");
      const user = (me as any)?.user || me || {};

      setSenderId(
        String(user?._id || user?.id || savedEmail || "traveler").trim()
      );

      setSenderName(
        String(user?.name || t.traveler).trim()
      );

      setSenderEmail(
        String(user?.email || savedEmail).trim().toLowerCase()
      );
    } catch {
      setSenderId(savedEmail || "traveler");
      setSenderName(t.traveler);
      setSenderEmail(savedEmail);
    }
  }

  async function loadMessages() {
    if (!bookingId) return;

    const data = await apiGet(
      `/api/chat/messages?bookingId=${bookingId}`
    );

    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.items)
        ? (data as any).items
        : Array.isArray((data as any)?.messages)
          ? (data as any).messages
          : [];

    setMessages(list);

    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: false });
    }, 80);
  }

  async function refreshChat() {
    try {
      setLoading(true);
      await loadMe();
      await loadMessages();
    } catch (e: any) {
      Alert.alert(t.error, e?.message || t.chatError);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const clean = String(text || "").trim();

    if (!clean) {
      return;
    }

    if (!bookingId) {
      Alert.alert(t.error, t.missingBooking);
      return;
    }

    const finalSenderId = String(
      senderId || senderEmail || "traveler"
    ).trim();

    const finalSenderEmail = String(senderEmail || "")
      .trim()
      .toLowerCase();

    try {
      const body = {
        bookingId: String(bookingId),
        senderId: finalSenderId,
        senderName: senderName || t.traveler,
        senderEmail: finalSenderEmail,
        senderType,
        text: clean,
        message: clean
      };

      try {
        await apiPost("/api/chat/messages", body);
      } catch (e: any) {
        if (String(e?.message || "").includes("404")) {
          await apiPost("/api/chat/send", body);
        } else {
          throw e;
        }
      }

      setText("");

      await loadMessages();

      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 120);
    } catch (e: any) {
      Alert.alert(t.error, e?.message || t.sendError);
    }
  }

  useEffect(() => {
    loadLang();
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {Platform.OS === "ios" && (
          <View
            style={{
              alignItems: "flex-start",
              paddingHorizontal: 16,
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: 8
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255,255,255,0.14)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.20)",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 999
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>{t.back}</Text>
            </Pressable>
          </View>
        )}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item, i) =>
            item._id || item.id || String(i)
          }
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 20
          }}
          renderItem={({ item }) => {
            const body =
              item.text ||
              item.message ||
              item.body ||
              item.content ||
              "";

            const mine =
              String(item.senderId || "") ===
              String(senderId || "");

            return (
              <View
                style={{
                  marginBottom: 10,
                  alignItems: mine ? "flex-end" : "flex-start"
                }}
              >
                <View
                  style={{
                    maxWidth: "80%",
                    borderRadius: 18,
                    padding: 14,
                    backgroundColor: mine
                      ? "#12b8a6"
                      : "rgba(255,255,255,0.20)",
                    borderWidth: 1,
                    borderColor: mine
                      ? "#12b8a6"
                      : "rgba(255,255,255,0.30)"
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
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
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                marginTop: 40
              }}
            >
              {loading ? t.loading : t.empty}
            </Text>
          }
        />

        <View
          style={{
            paddingHorizontal: 14,
            paddingBottom: bottomGap,
            paddingTop: 8
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: 24,
              paddingHorizontal: 10,
              paddingVertical: 6
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t.placeholder}
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
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "800"
                }}
              >
                {t.send}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}