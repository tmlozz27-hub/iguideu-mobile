import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const isGuide = role === "guide";
  const isTraveler = role === "traveler";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#A9C9F5",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 42,
          fontWeight: "800",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        I GUIDE U
      </Text>

      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 28,
          fontWeight: "800",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        {isGuide ? "Registro de Guía" : "Registro de Viajero"}
      </Text>

      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        {isGuide
          ? "Completá tu alta como guía"
          : "Completá tu alta como viajero"}
      </Text>

      {isTraveler ? (
        <View style={{ width: "100%" }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre"
            placeholderTextColor="#EAF4FF"
            autoCapitalize="words"
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 18,
              fontSize: 18,
              marginBottom: 14,
            }}
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            placeholderTextColor="#EAF4FF"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 18,
              fontSize: 18,
              marginBottom: 14,
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor="#EAF4FF"
            secureTextEntry
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 18,
              fontSize: 18,
              marginBottom: 14,
            }}
          />

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#EAF4FF"
            secureTextEntry
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 18,
              fontSize: 18,
              marginBottom: 14,
            }}
          />

          <Pressable
            onPress={() => setAccepted((prev) => !prev)}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 18,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: "#FFFFFF",
                backgroundColor: accepted ? "#FFFFFF" : "transparent",
                marginRight: 12,
                marginTop: 2,
              }}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                flex: 1,
                lineHeight: 20,
              }}
            >
              Acepto los Términos y Condiciones y la Política de Privacidad
            </Text>
          </Pressable>

          <Pressable
            style={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: 22,
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Text
              style={{
                color: "#0B66B3",
                fontSize: 22,
                fontWeight: "800",
              }}
            >
              CONTINUAR
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            style={{ marginTop: 14 }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Volver al login
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre completo"
            placeholderTextColor="#EAF4FF"
            autoCapitalize="words"
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 18,
              fontSize: 18,
              marginBottom: 14,
            }}
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            placeholderTextColor="#EAF4FF"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 18,
              fontSize: 18,
              marginBottom: 14,
            }}
          />

          <Pressable
            style={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: 22,
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Text
              style={{
                color: "#0B66B3",
                fontSize: 22,
                fontWeight: "800",
              }}
            >
              CONTINUAR
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            style={{ marginTop: 14 }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Volver al login
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}