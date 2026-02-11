import { createReservation, createIntent } from "./api";

export async function bookAndCreateIntent(input: {
  travelerEmail: string;
  gid: string; // OJO: gid = guide.id (no _id)
  date: string; // yyyy-mm-dd
  hours: number;
  amount: number; // en centavos
  currency: string; // "usd"
}) {
  const bookingRes = await createReservation({
    travelerEmail: input.travelerEmail,
    gid: input.gid,
    date: input.date,
    hours: input.hours
  });

  const bookingId =
    bookingRes?.reservation?._id ||
    bookingRes?.booking?._id ||
    bookingRes?.bookingId ||
    bookingRes?._id ||
    null;

  if (!bookingId) {
    throw new Error("No bookingId en respuesta de /api/reservations");
  }

  const payRes = await createIntent({
    amount: input.amount,
    currency: input.currency,
    bookingId,
    email: input.travelerEmail
  });

  const clientSecret =
    payRes?.clientSecret || payRes?.client_secret || payRes?.clientSecretKey || null;

  if (!clientSecret) {
    throw new Error("No clientSecret en respuesta de /api/payments/create-intent");
  }

  return {
    bookingId,
    clientSecret,
    paymentIntentId: payRes?.paymentIntentId || null
  };
}
