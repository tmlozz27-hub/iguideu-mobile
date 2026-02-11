import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Unmatched Route</Text>
      <Text style={{ opacity: 0.7 }}>Esta ruta no existe. Volvé al inicio.</Text>

      <Link href="/(tabs)" asChild>
        <Pressable style={{ paddingVertical: 12, paddingHorizontal: 18, borderWidth: 1, borderRadius: 12 }}>
          <Text style={{ fontWeight: "700" }}>Ir a Inicio</Text>
        </Pressable>
      </Link>
    </View>
  );
}
