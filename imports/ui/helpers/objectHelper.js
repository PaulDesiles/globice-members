function getRelevantKeys(obj) {
  return Object.keys(obj)
    .filter(k => !k.startsWith('_'));
}


export function getAllProperties(obj, nested) {
  let properties = {};

  if (obj) {
    if (nested) {
      getRelevantKeys(obj).forEach(rootKey => {
        Object.keys(obj[rootKey]).forEach(key => properties[`${rootKey}.${key}`] = obj[rootKey][key]);
      });
    } else {
      getRelevantKeys(obj).forEach(key => properties[key] = obj[key]);
    }
  }

  return properties;
}


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

  return a == b;
}

export function getDelta(newValues, oldValues) {
  return getRelevantKeys(newValues)
    .filter(k => !areEqual(newValues[k], oldValues[k]));
}