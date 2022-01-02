function getRelevantKeys(obj) {
  return Object.keys(obj)
    .filter(k => !k.startsWith('_'));
}

function clone(value) {
  if (typeof value.getTime === 'function') // Date
    return new Date(value);
  else if (typeof value.push === 'function') // Array
    return [...value];
  else if (typeof value === 'object') // Object
    return {...value};
  else
    return value;
}

export function getAllProperties(obj, nested, excludeKeys = []) {
  let properties = {};

  if (obj) {
    if (nested) {
      getRelevantKeys(obj).forEach(rootKey => {
        getRelevantKeys(obj[rootKey])
          .filter(key => !excludeKeys.some(e => e === `${rootKey}.${key}`))
          .forEach(key => properties[`${rootKey}.${key}`] = clone(obj[rootKey][key]));
      });
    } else {
      getRelevantKeys(obj)
        .filter(key => !excludeKeys.some(e => e === key))
        .forEach(key => properties[key] = clone(obj[key]));
    }
  }

  return properties;
}


function areEqual(a, b) {
  if (typeof a !== 'boolean' && a && b) {
    if (typeof a.getTime === 'function') // Date comparison
      return a.getTime() === b.getTime();

    if (typeof a.push === 'function') // Array comparison
    {
      if (a.length !== b.length)
        return false;
      
      return a.every(ax => b.some(bx => areEqual(ax, bx)));
    }

    if (typeof a === 'object')
      return getRelevantKeys(a).every(k => areEqual(a[k], b[k]));
  }

  return a == b;
}

export function getDelta(newValues, oldValues) {
  return getRelevantKeys(newValues)
    .filter(k => !areEqual(newValues[k], oldValues[k]));
}