
export function ensureUserConnected(userId) {
  if (!userId) {
    throw new Meteor.Error('Not authorized.');
  }
}

export function ensureContainsUpdates(changes) {
  if (changes.length === 0){
    throw new Meteor.Error('No values to update');
  }
}

export function addCreationDate(changes) {
  changes.push({
    key: 'creationDate',
    value: new Date(Date.now())
  });
}

export function addModificationDate(changes) {
  changes.push({
    key: 'modificationDate',
    value: new Date(Date.now())
  });
}
export function arrayToObject(arrayChanges) {
  let objChanges = {};
  arrayChanges.forEach(x => {
    objChanges[x.key] = x.value;
  })

  return objChanges;
}
