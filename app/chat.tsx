import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiGet, apiPost } from "../config/api";

type Message = {
  _id?: string;
  text: string;
  createdAt?: string;
};

export default function ChatScreen() {
  const { bookingId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  async function loadMessages() {
    try {
      if (!bookingId) return;

      const data = await apiGet(`/api/chat/messages?bookingId=${bookingId}`);

      if (data?.items) {
        setMessages(data.items);
      }
    } catch (e) {
      console.log("CHAT LOAD ERROR", e);
    }
  }

  async function sendMessage() {
    try {
      if (!bookingId || !text.trim()) return;

      const res = await apiPost("/api/chat/messages", {
        bookingId,
        senderId: "me",
        senderType: "traveler",
        text,
      });

      if (res?.item) {
        setMessages((prev) => [...prev, res.item]);
        setText("");
      }
    } catch (e) {
      console.log("CHAT SEND ERROR", e);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [bookingId]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Chat</Text>

      <ScrollView style={{ flex: 1, marginVertical: 10 }}>
        {messages.map((m, i) => (
          <Text key={i} style={{ marginBottom: 8 }}>
            {m.text}
          </Text>
        ))}
      </ScrollView>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Mensaje..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />

      <Pressable
        onPress={sendMessage}
        style={{
          backgroundColor: "#0f9fb3",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          Enviar
        </Text>
      </Pressable>
    </View>
  );
}