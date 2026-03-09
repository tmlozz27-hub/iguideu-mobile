export type ReservationDraftGuide = {
  guideId?: string;
  guideName?: string;
  city?: string;
  country?: string;
};

let currentDraftGuide: ReservationDraftGuide | null = null;

export function setReservationDraftGuide(guide: ReservationDraftGuide | null) {
  currentDraftGuide = guide;
}

export function getReservationDraftGuide() {
  return currentDraftGuide;
}

export function clearReservationDraftGuide() {
  currentDraftGuide = null;
}