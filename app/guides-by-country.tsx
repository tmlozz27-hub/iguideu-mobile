import React, { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { apiGet } from "../config/api"

type GuideItem = {
  _id?: string
  id?: string
  name?: string
  country?: string
  city?: string
  bio?: string
  languages?: string[]
  priceHour?: number
}

export default function GuidesByCountryScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ country?: string }>()

  const [loading, setLoading] = useState(true)
  const [guides, setGuides] = useState<GuideItem[]>([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await apiGet("/api/guides")

        const list = Array.isArray(data) ? data : []

        // ⚠️ fallback: SIEMPRE mostrar algo
        setGuides(list)
      } catch {
        setGuides([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {guides.map((g, i) => {
          const id = g._id || g.id || String(i)

          return (
            <Pressable
              key={id}
              onPress={() =>
                router.push({
                  pathname: "/guia-detalle",
                  params: { id }
                })
              }
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 12,
                marginBottom: 10
              }}
            >
              <Text style={{ fontWeight: "700", fontSize: 16 }}>
                {g.name || "Guía"}
              </Text>

              <Text>{g.city || "-"}</Text>

              <Text>{g.bio || "Guía disponible"}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}