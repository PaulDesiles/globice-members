
export function ensureUserConnected(userId) {
  if (!userId) {
    throw new Meteor.Error('Not authorized.');
  }
}

function isArray(x) {
  return typeof x.length === 'number';
}

export function ensureContainsUpdates(changes) {
  if ((isArray(changes) && changes.length === 0)
    || Object.keys(changes).length === 0)
  {
    throw new Meteor.Error('No values to update');
  }
}

function addKeyValue(container, key, value) {
  if (isArray(container)) {
    container.push({ key, value });
  } else {
    container[key] = value;
  }
}

export function addCreationDate(changes) {
    addKeyValue(changes, '_creationDate', new Date());
}

export function addModificationDate(changes) {
  addKeyValue(changes, '_modificationDate', new Date());
}

export function arrayToObject(arrayChanges) {
  let objChanges = {};
  arrayChanges.forEach(x => {
    objChanges[x.key] = x.value;
  })

  return objChanges;
}
