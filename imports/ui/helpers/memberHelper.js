const pivotMembershipDate = Date.UTC(new Date().getUTCFullYear() - 1, 4, 1,0, 0, 0);

export function isMembershipUpToDate(member) {
  return member.membership.date > pivotMembershipDate;
}

export function getTotalTripsBought(purchases) {
  return purchases.reduce((prev, cur) => prev.size + cur, 0);
}

export function getTripsLeft(member) {
  const bought = getTotalTripsBought(member.trips.purchases);
  const consumed = member.trips.confirmedTrips.length;
    //.filter(t => t.credited)

  return Math.max(0, bought - consumed);
}