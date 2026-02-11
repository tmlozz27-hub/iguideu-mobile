import { View, Text, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function MissingRoute() {
  const router = useRouter();
  const path = usePathname();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
        Ruta no disponible
      </Text>

      <Text style={{ textAlign: "center", marginBottom: 24 }}>
        La sección "{path}" no está habilitada en esta versión.
      </Text>

      <Pressable
        onPress={() => router.replace("/")}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 10,
          borderWidth: 1,
        }}
      >
        <Text>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}
