import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
  id: string;
  text: string;
  sender: "traveler" | "guide";
};

export default function ChatroomScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I am interested in your tour.",
      sender: "traveler",
    },
    {
      id: "2",
      text: "Great! When would you like to start?",
      sender: "guide",
    },
  ]);

  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "traveler",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          style={{ flex: 1 }}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf:
                  item.sender === "traveler"
                    ? "flex-end"
                    : "flex-start",
                backgroundColor:
                  item.sender === "traveler"
                    ? "#007AFF"
                    : "#eee",
                padding: 10,
                borderRadius: 10,
                marginBottom: 8,
                maxWidth: "70%",
              }}
            >
              <Text
                style={{
                  color:
                    item.sender === "traveler"
                      ? "white"
                      : "black",
                }}
              >
                {item.text}
              </Text>
            </View>
          )}
        />

        <View
          style={{
            flexDirection: "row",
            padding: 10,
            borderTopWidth: 1,
            borderColor: "#eee",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 20,
              paddingHorizontal: 12,
              marginRight: 10,
            }}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={{
              backgroundColor: "#007AFF",
              paddingHorizontal: 16,
              justifyContent: "center",
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}