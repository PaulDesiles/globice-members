export function sortDates(a,b) {
  if (!a?.getTime || !b?.getTime)
    return 0;

  const at = a.getTime();
  const bt = b.getTime();
  if (at === bt)
    return 0;
  else if (at > bt)
    return 1;
  else
    return -1;
}

export function formatDate(d) {
  return d?.toLocaleDateString(
    'fr-FR', 
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  );
}