import React, { useEffect, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { apiGet } from "../config/api"

type Guide = {
  _id?: string
  id?: string
  name?: string
  city?: string
  country?: string
  bio?: string
  lat?: number
  lng?: number
  latitude?: number
  longitude?: number
}

export default function GuiasCercanosScreen() {
  const router = useRouter()

  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [center, setCenter] = useState({ lat: -34.6037, lng: -58.3816 })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)

      let lat = -34.6037
      let lng = -58.3816

      try {
        const permission = await Location.requestForegroundPermissionsAsync()

        if (permission.status === "granted") {
          const loc = await Location.getCurrentPositionAsync({})
          lat = loc.coords.latitude
          lng = loc.coords.longitude
        }
      } catch {}

      setCenter({ lat, lng })

      let data = await apiGet(`/api/guides/nearby?lat=${lat}&lng=${lng}&radius=50`)

      let arr = Array.isArray(data?.items) ? data.items : []

      if (arr.length === 0) {
        const fallback = await apiGet("/api/guides")
        arr = Array.isArray(fallback) ? fallback : []
      }

      setGuides(arr)
    } catch (e) {
      console.log("ERROR", e)
      setGuides([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2
        }}
      >
        <Marker coordinate={{ latitude: center.lat, longitude: center.lng }} title="Tu ubicación" />

        {guides.map((g, i) => {
          const lat = g.lat || g.latitude
          const lng = g.lng || g.longitude

          if (!lat || !lng) return null

          return (
            <Marker
              key={g._id || g.id || String(i)}
              coordinate={{ latitude: lat, longitude: lng }}
              title={g.name || "Guía"}
            />
          )
        })}
      </MapView>

      <ScrollView style={{ maxHeight: 250 }}>
        {guides.map((g, i) => {
          const id = g._id || g.id || String(i)

          return (
            <Pressable
              key={id}
              onPress={() =>
                router.push({
                  pathname: "/guia-detalle",
                  params: {
                    id,
                    guideData: JSON.stringify(g)
                  }
                })
              }
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ddd"
              }}
            >
              <Text style={{ fontWeight: "700" }}>{g.name || "Guía"}</Text>
              <Text>{g.city || "-"}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}
