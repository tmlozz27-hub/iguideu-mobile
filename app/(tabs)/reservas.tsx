import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiGet } from "../../config/api";

type Booking = {
  _id?: string;
  bookingId?: string;
  guideName?: string;
  travelerEmail?: string;
  date?: string;
  status?: string;
  paymentStatus?: string;
};

export default function ReservasScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadBookings() {
    try {
      const data = await apiGet<Booking[]>("/api/bookings");
      const arr = Array.isArray(data) ? data : [];
      setBookings(arr);
    } catch (e) {
      console.log("ERROR loadBookings()", e);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    loadBookings();
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={bookings}
        keyExtractor={(item, index) =>
          item._id || item.bookingId || index.toString()
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {item.guideName || "Guide"}
            </Text>

            {item.date && (
              <Text style={{ marginTop: 4 }}>
                Date: {new Date(item.date).toLocaleDateString()}
              </Text>
            )}

            <Text style={{ marginTop: 4 }}>
              Status: {item.status || "PENDING"}
            </Text>

            <Text style={{ marginTop: 4 }}>
              Payment: {item.paymentStatus || "UNPAID"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}