import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
  id: string;
  text: string;
  sender: "traveler" | "guide";
  time: string;
};

export default function ChatroomScreen() {
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  const colors = dark
    ? {
        bg: "#0B0B0C",
        header: "#111113",
        border: "#1E1E22",
        guideBubble: "#1A1A1E",
        travelerBubble: "#2563EB",
        text: "#FFFFFF",
        sub: "#9CA3AF",
        input: "#16161A",
      }
    : {
        bg: "#F5F7FB",
        header: "#FFFFFF",
        border: "#E5E7EB",
        guideBubble: "#FFFFFF",
        travelerBubble: "#111827",
        text: "#111827",
        sub: "#6B7280",
        input: "#F3F4F6",
      };

  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm nearby and available to help you explore the city today.",
      sender: "guide",
      time: "10:14",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const guideName = useMemo(() => "Local Guide", []);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const getTime = () => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "traveler",
      time: getTime(),
    };

    setMessages((p) => [...p, msg]);
    setInput("");

    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),
          text: "Sounds good 👍",
          sender: "guide",
          time: getTime(),
        },
      ]);
    }, 1500);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const traveler = item.sender === "traveler";

    return (
      <View
        style={[
          styles.row,
          { justifyContent: traveler ? "flex-end" : "flex-start" },
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: traveler
                ? colors.travelerBubble
                : colors.guideBubble,
            },
          ]}
        >
          <Text
            style={{
              color: traveler ? "#fff" : colors.text,
              fontSize: 15,
            }}
          >
            {item.text}
          </Text>

          <Text
            style={{
              fontSize: 10,
              marginTop: 4,
              color: traveler ? "#d1d5db" : colors.sub,
              alignSelf: "flex-end",
            }}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.header, borderBottomColor: colors.border },
          ]}
        >
          <Text style={{ fontSize: 17, fontWeight: "600", color: colors.text }}>
            {guideName}
          </Text>

          <Text style={{ fontSize: 12, color: "#22c55e" }}>Online</Text>
        </View>

        {/* RESERVA CARD */}
        <View
          style={[
            styles.bookingCard,
            { backgroundColor: colors.header, borderColor: colors.border },
          ]}
        >
          <Text style={{ fontWeight: "600", color: colors.text }}>
            City Walking Tour
          </Text>

          <TouchableOpacity style={styles.bookBtn}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Book Guide</Text>
          </TouchableOpacity>
        </View>

        {/* MENSAJES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />

        {/* TYPING */}
        {typing && (
          <Text style={{ marginLeft: 14, color: colors.sub }}>
            guide typing...
          </Text>
        )}

        {/* INPUT */}
        <View
          style={[
            styles.inputBar,
            { backgroundColor: colors.header, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity style={styles.iconBtn}>
            <Text>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Text>📍</Text>
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message..."
            placeholderTextColor={colors.sub}
            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
          />

          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 14,
    borderBottomWidth: 1,
  },

  bookingCard: {
    margin: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bookBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  row: {
    marginVertical: 6,
  },

  bubble: {
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
  },

  input: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
  },

  iconBtn: {
    paddingHorizontal: 6,
  },

  sendBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
});