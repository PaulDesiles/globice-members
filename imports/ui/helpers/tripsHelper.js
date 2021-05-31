export function getLastXMonthsCount(tripsList, x, memberId) {
  const today = new Date();
  const comparisonTime = today.setMonth(today.getMonth() - x);

  let list = tripsList
    ?.filter(t => getTime(t.date) > comparisonTime);
  
  if (memberId)
    list = list?.filter(t => {
      const applicant = t.applicants?.find(a => a.memberId === memberId);
      return applicant?.credited;
    });

  return list?.length || 0;
}

function getTime(date) {
  if (date && date.getTime)
    return date.getTime();
  else {
    var d = new Date(date);
    if (d) {
      return d.getTime();
    }
  }

  return 0;
}