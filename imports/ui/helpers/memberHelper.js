import { isTripCredited } from './tripsHelper';
import { ensureIsDate } from './dateHelper';

const pivotMembershipDate = Date.UTC(new Date().getUTCFullYear() - 1, 4, 1,0, 0, 0);

export function isMembershipUpToDate(date) {
  return ensureIsDate(date) > pivotMembershipDate;
}

export function getTotalTripsBought(purchases) {
  return purchases.reduce((prev, cur) => prev + cur.size, 0);
}

export function getTripsLeft(memberId, purchases, confirmedTrips) {
  const bought = getTotalTripsBought(purchases);
  const consumed = confirmedTrips
    .filter(t => isTripCredited(t, memberId))
    .length;

  return Math.max(0, bought - consumed);
}