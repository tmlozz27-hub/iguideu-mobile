import React, { useEffect, useState } from "react"
import { View, Text, TextInput, Pressable, ScrollView } from "react-native"
import { apiGet, apiPost } from "../config/api"

type Message = {
  _id: string
  text: string
  sender: string
  createdAt: string
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")

  const loadMessages = async () => {
    try {
      const data = await apiGet("/api/chat")
      if (Array.isArray(data)) setMessages(data)
    } catch {}
  }

  const sendMessage = async () => {
    const clean = text.trim()
    if (!clean) return

    try {
      const data = await apiPost("/api/chat", {
        text: clean
      })

      if (data) {
        setMessages((prev) => [...prev, data])
        setText("")
      }
    } catch {}
  }

  useEffect(() => {
    loadMessages()
  }, [])

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1, marginBottom: 12 }}>
        {messages.map((m) => (
          <View key={m._id} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "700" }}>{m.sender}</Text>
            <Text>{m.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Mensaje..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10
          }}
        />

        <Pressable
          onPress={sendMessage}
          style={{
            backgroundColor: "#0f9fb3",
            padding: 12,
            borderRadius: 10
          }}
        >
          <Text style={{ color: "#fff" }}>Enviar</Text>
        </Pressable>
      </View>
    </View>
  )
}