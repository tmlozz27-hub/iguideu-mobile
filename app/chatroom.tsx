import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Chatroom() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Chat no disponible por el momento
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
        <Text>Ir al inicio</Text>
      </Pressable>
    </View>
  );
}
