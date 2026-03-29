import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const isGuide = role === "guide";
  const isTraveler = role === "traveler";

  const [travelerName, setTravelerName] = useState("");
  const [travelerEmail, setTravelerEmail] = useState("");
  const [travelerPassword, setTravelerPassword] = useState("");
  const [travelerConfirmPassword, setTravelerConfirmPassword] = useState("");
  const [travelerAccepted, setTravelerAccepted] = useState(false);
  const [travelerShowPassword, setTravelerShowPassword] = useState(false);
  const [travelerShowConfirmPassword, setTravelerShowConfirmPassword] = useState(false);

  const [guideName, setGuideName] = useState("");
  const [guideEmail, setGuideEmail] = useState("");
  const [guidePassword, setGuidePassword] = useState("");
  const [guideConfirmPassword, setGuideConfirmPassword] = useState("");
  const [guideAccepted, setGuideAccepted] = useState(false);
  const [guideShowPassword, setGuideShowPassword] = useState(false);
  const [guideShowConfirmPassword, setGuideShowConfirmPassword] = useState(false);

  const handleTravelerContinue = () => {
    const cleanName = travelerName.trim();
    const cleanEmail = travelerEmail.trim().toLowerCase();

    if (!cleanName) {
      Alert.alert("Falta el nombre", "Ingresá tu nombre.");
      return;
    }

    if (!cleanEmail) {
      Alert.alert("Falta el correo", "Ingresá tu correo electrónico.");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      Alert.alert("Correo inválido", "Ingresá un correo electrónico válido.");
      return;
    }

    if (!travelerPassword) {
      Alert.alert("Falta la contraseña", "Ingresá una contraseña.");
      return;
    }

    if (travelerPassword.length < 6) {
      Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!travelerConfirmPassword) {
      Alert.alert("Falta confirmar", "Confirmá tu contraseña.");
      return;
    }

    if (travelerPassword !== travelerConfirmPassword) {
      Alert.alert("Contraseñas distintas", "La contraseña y su confirmación no coinciden.");
      return;
    }

    if (!travelerAccepted) {
      Alert.alert(
        "Falta aceptación",
        "Debés aceptar los Términos y Condiciones y la Política de Privacidad."
      );
      return;
    }

    Alert.alert("OK", "Validación viajero completa. El próximo paso es conectar este alta al backend.");
  };

  const handleGuideContinue = () => {
    const cleanName = guideName.trim();
    const cleanEmail = guideEmail.trim().toLowerCase();

    if (!cleanName) {
      Alert.alert("Falta el nombre", "Ingresá tu nombre completo.");
      return;
    }

    if (!cleanEmail) {
      Alert.alert("Falta el correo", "Ingresá tu correo electrónico.");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      Alert.alert("Correo inválido", "Ingresá un correo electrónico válido.");
      return;
    }

    if (!guidePassword) {
      Alert.alert("Falta la contraseña", "Ingresá una contraseña.");
      return;
    }

    if (guidePassword.length < 6) {
      Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!guideConfirmPassword) {
      Alert.alert("Falta confirmar", "Confirmá tu contraseña.");
      return;
    }

    if (guidePassword !== guideConfirmPassword) {
      Alert.alert("Contraseñas distintas", "La contraseña y su confirmación no coinciden.");
      return;
    }

    if (!guideAccepted) {
      Alert.alert(
        "Falta aceptación",
        "Debés aceptar los Términos y Condiciones y la Política de Privacidad."
      );
      return;
    }

    Alert.alert("OK", "Validación guía completa. El próximo paso es agregar los campos profesionales.");
  };

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
            value={travelerName}
            onChangeText={setTravelerName}
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
            value={travelerEmail}
            onChangeText={setTravelerEmail}
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

          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              borderRadius: 18,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <TextInput
              value={travelerPassword}
              onChangeText={setTravelerPassword}
              placeholder="Contraseña"
              placeholderTextColor="#EAF4FF"
              secureTextEntry={!travelerShowPassword}
              style={{
                flex: 1,
                color: "#FFFFFF",
                paddingHorizontal: 18,
                paddingVertical: 18,
                fontSize: 18,
              }}
            />
            <Pressable
              onPress={() => setTravelerShowPassword((prev) => !prev)}
              style={{ paddingHorizontal: 14, paddingVertical: 12 }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>
                {travelerShowPassword ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              borderRadius: 18,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <TextInput
              value={travelerConfirmPassword}
              onChangeText={setTravelerConfirmPassword}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#EAF4FF"
              secureTextEntry={!travelerShowConfirmPassword}
              style={{
                flex: 1,
                color: "#FFFFFF",
                paddingHorizontal: 18,
                paddingVertical: 18,
                fontSize: 18,
              }}
            />
            <Pressable
              onPress={() => setTravelerShowConfirmPassword((prev) => !prev)}
              style={{ paddingHorizontal: 14, paddingVertical: 12 }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>
                {travelerShowConfirmPassword ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => setTravelerAccepted((prev) => !prev)}
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
                backgroundColor: travelerAccepted ? "#FFFFFF" : "transparent",
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
            onPress={handleTravelerContinue}
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
            <Text style={{ color: "#0B66B3", fontSize: 22, fontWeight: "800" }}>
              CONTINUAR
            </Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/login")} style={{ marginTop: 14 }}>
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
            value={guideName}
            onChangeText={setGuideName}
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
            value={guideEmail}
            onChangeText={setGuideEmail}
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

          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              borderRadius: 18,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <TextInput
              value={guidePassword}
              onChangeText={setGuidePassword}
              placeholder="Contraseña"
              placeholderTextColor="#EAF4FF"
              secureTextEntry={!guideShowPassword}
              style={{
                flex: 1,
                color: "#FFFFFF",
                paddingHorizontal: 18,
                paddingVertical: 18,
                fontSize: 18,
              }}
            />
            <Pressable
              onPress={() => setGuideShowPassword((prev) => !prev)}
              style={{ paddingHorizontal: 14, paddingVertical: 12 }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>
                {guideShowPassword ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.22)",
              borderRadius: 18,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <TextInput
              value={guideConfirmPassword}
              onChangeText={setGuideConfirmPassword}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#EAF4FF"
              secureTextEntry={!guideShowConfirmPassword}
              style={{
                flex: 1,
                color: "#FFFFFF",
                paddingHorizontal: 18,
                paddingVertical: 18,
                fontSize: 18,
              }}
            />
            <Pressable
              onPress={() => setGuideShowConfirmPassword((prev) => !prev)}
              style={{ paddingHorizontal: 14, paddingVertical: 12 }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>
                {guideShowConfirmPassword ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => setGuideAccepted((prev) => !prev)}
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
                backgroundColor: guideAccepted ? "#FFFFFF" : "transparent",
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
            onPress={handleGuideContinue}
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
            <Text style={{ color: "#0B66B3", fontSize: 22, fontWeight: "800" }}>
              CONTINUAR
            </Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/login")} style={{ marginTop: 14 }}>
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