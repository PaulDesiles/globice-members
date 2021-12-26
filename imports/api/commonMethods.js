import { normalizeTerm } from '../commonHelpers/searchHelper';

function ensureUserIsInRoles(userId, roles) {
  if (!userId) {
    throw new Meteor.Error('Not connected');
  }

  if (!Roles.userIsInRole(userId, roles)) {
    throw new Meteor.Error('Not authorized');
  }
}

export function ensureIsAdmin(userId) {
  ensureUserIsInRoles(userId, ['admin']);
}

export function ensureCanEditTrips(userId) {
  ensureUserIsInRoles(userId, ['admin', 'captain']);
}

export function ensureCanViewData(userId) {
  ensureUserIsInRoles(userId, ['admin', 'captain', 'viewer']);
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
    addValueToObjectRecursively(container, key.split('.'), value);
  }
}

function addValueToObjectRecursively(container, keys, value) {
  if (keys.length == 1) {
    container[key] = value;
  } else {
    return addValueToObjectRecursively(container[keys.shift()], keys, value);
  }
}

function getValue(container, key) {
  if (isArray(container)) {
    return container.filter(x => x.key == key).map(x => x.value)[0];
  } else {
    getObjectValueRecursively(container, key.split('.'));
  }
}

function getObjectValueRecursively(container, keys) {
  if (keys.length == 1) {
    return container[key];
  } else {
    keys.shift();
    return getObjectValueRecursively(container[key], keys);
  }
}

export function addCreationDate(changes) {
    addKeyValue(changes, '_creationDate', new Date());
}

export function addModificationDate(changes) {
  addKeyValue(changes, '_modificationDate', new Date());
}

export function addSearchChanges(changes) {
  console.log(changes);

  ['firstname', 'lastname', 'email'].forEach(k => {
    const value = getValue(changes, `infos.${k}`);
    console.log(value);
    if (value) {
      addKeyValue(changes, `search.${k}`, normalizeTerm(value));
    }
  });

  console.log(changes);
}

export function arrayToObject(arrayChanges) {
  let objChanges = {};
  arrayChanges.forEach(x => {
    objChanges[x.key] = x.value;
  })

  return objChanges;
}
