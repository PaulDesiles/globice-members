// for some reason dates are sometimes wrongly passed to components as string...
export function ensureIsDate(date) {
  if (!date)
    return;

  return date.getTime ? date : new Date(date);
}

export function sortDates(a,b) {
  if (!a || !b)
    return 0;

  const at = ensureIsDate(a).getTime();
  const bt = ensureIsDate(b).getTime();
  if (at === bt)
    return 0;
  else if (at > bt)
    return 1;
  else
    return -1;
}

export function formatDate(d) {
  return ensureIsDate(d)?.toLocaleDateString(
    'fr-FR', 
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  );
}