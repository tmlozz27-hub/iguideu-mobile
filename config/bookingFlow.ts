export type BookingInput = {
  travelerEmail: string;
  date: string;
  hours: number;
  guideId: string;
};

export type PaymentInput = {
  bookingId: string;
  amount: number;
  amountUsd: number;
  amountCents: number;
};

export function createReservationPayload(input: BookingInput) {
  return {
    travelerEmail: input.travelerEmail,
    date: input.date,
    hours: input.hours,
    guideId: input.guideId
  };
}

export function createPaymentPayload(input: PaymentInput) {
  return {
    bookingId: input.bookingId,
    amount: input.amount,
    amountUsd: input.amountUsd,
    amountCents: input.amountCents
  };
}