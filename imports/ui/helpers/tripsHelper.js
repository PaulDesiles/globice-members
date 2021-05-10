export function getLastXMonthsCount(tripsList, x) {
  const today = new Date();
  const comparisonTime = today.setMonth(today.getMonth() - x);

  return tripsList
    ?.filter(t => t.date && t.date.getTime() > comparisonTime)
      .length 
    || 0;
}