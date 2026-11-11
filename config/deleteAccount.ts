import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./api";

export async function requestAccountDeletion(): Promise<void> {
  const token = await AsyncStorage.getItem("iguideu_token");

  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }

  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      confirmation: "DELETE MY ACCOUNT"
    })
  });

  if (!response.ok) {
    throw new Error(`DELETE_REQUEST_FAILED_${response.status}`);
  }

  const result = await response.json();

  if (
    result?.ok !== true ||
    result?.message !== "ACCOUNT_DELETION_REQUESTED"
  ) {
    throw new Error("INVALID_DELETE_RESPONSE");
  }
}
