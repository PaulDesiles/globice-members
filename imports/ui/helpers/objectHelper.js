
function areEqual(a, b) {
  if (a && b) {
    if (typeof a.getTime === 'function') // Date comparison
      return a.getTime() === b.getTime();

    if (typeof a.push === 'function') // Array comparison
    {
      if (a.length !== b.length)
        return false;
      
      return a.every(ax => b.some(bx => areEqual(ax, bx)));
    }

    if (typeof a === 'object')
      return Object.keys(a).every(k => areEqual(a[k], b[k]));
  }

  return a === b;
}

export function getDelta(newValues, oldValues) {
  return Object.keys(newValues).filter(k => !areEqual(newValues[k], oldValues[k]));
}