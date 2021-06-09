import { ensureIsDate } from './dateHelper';

export function isTripCredited(trip, memberId) {
  if (trip.id) {
    // sumup trip object
    return trip.credited;
  } else if (trip._id) {
    // full trip object
    const applicant = trip.applicants.find(a => a.memberId === memberId);
    return applicant.credited;
  }
}

export function getLastXMonthsCount(tripsList, x, memberId) {
  const today = new Date();
  const comparisonTime = today.setMonth(today.getMonth() - x);

  let list = tripsList
    ?.filter(t => (ensureIsDate(t.date)?.getTime() ?? 0) > comparisonTime);
  
  if (memberId)
    list = list?.filter(t => isTripCredited(t, memberId));

  return list?.length || 0;
}