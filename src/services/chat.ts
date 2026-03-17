import { API_BASE } from "../../config/api"

async function readJsonSafe(res) {
  const raw = await res.text()
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function getChatMessages(bookingId) {
  const id = String(bookingId || "").trim()
  if (!id) throw new Error("bookingId required")

  const res = await fetch(
    `${API_BASE}/api/chat/messages?bookingId=${encodeURIComponent(id)}`,
    { method: "GET" }
  )

  const data = await readJsonSafe(res)

  if (!res.ok) {
    throw new Error((data && data.error) || `CHAT_MESSAGES_${res.status}`)
  }

  return Array.isArray(data && data.items) ? data.items : []
}

export async function sendChatMessage(input) {
  const bookingId = String((input && input.bookingId) || "").trim()
  const senderId = String((input && input.senderId) || "").trim()
  const senderType = String((input && input.senderType) || "").trim()
  const text = String((input && input.text) || "").trim()

  if (!bookingId) throw new Error("bookingId required")
  if (!senderId) throw new Error("senderId required")
  if (!senderType) throw new Error("senderType required")
  if (!text) throw new Error("text required")

  const res = await fetch(`${API_BASE}/api/chat/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bookingId,
      senderId,
      senderType,
      text
    })
  })

  const data = await readJsonSafe(res)

  if (!res.ok) {
    throw new Error((data && data.error) || `CHAT_SEND_${res.status}`)
  }

  return data && data.item
}
