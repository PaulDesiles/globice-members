import { normalizeTermForSearch } from '../commonHelpers/searchHelper';

export let ROLES = {
  admin: 'admin',
  captain: 'captain',
  viewer: 'viewer'
};

function ensureUserIsInRoles(userId, roles) {
  if (!userId) {
    throw new Meteor.Error('Not connected');
  }

  if (!Roles.userIsInRole(userId, roles)) {
    throw new Meteor.Error('Not authorized');
  }
}

export function ensureIsAdmin(userId) {
  ensureUserIsInRoles(userId, [ ROLES.admin ]);
}

export function ensureCanEditTrips(userId) {
  ensureUserIsInRoles(userId, [ROLES.admin, ROLES.captain]);
}

export function ensureCanViewData(userId) {
  ensureUserIsInRoles(userId, [ROLES.admin, ROLES.captain, ROLES.viewer]);
}

export function isArray(x) {
  return typeof x.length === 'number';
}

export function ensureContainsUpdates(changes) {
  if (!changes 
    || (isArray(changes) && changes.length === 0)
    || Object.keys(changes).length === 0)
  {
    throw new Meteor.Error('No values to update');
  }
}

export function addKeyValue(container, key, value) {
  if (isArray(container)) {
    container.push({ key, value });
  } else {
    addValueToObjectRecursively(container, key.split('.'), value);
  }
}

function addValueToObjectRecursively(container, keys, value) {
  if (keys.length == 1) {
    container[keys[0]] = value;
  } else {
    var key = keys.shift();
    var nestedContainer = container[key];
    if (!nestedContainer) {
      nestedContainer = {};
      container[key] = nestedContainer;
    }
    return addValueToObjectRecursively(nestedContainer, keys, value);
  }
}

export function getValue(container, key) {
  if (isArray(container))
    return container.filter(x => x.key == key).map(x => x.value)[0];

  return getObjectValueRecursively(container, key.split('.'));
}

function getObjectValueRecursively(container, keys) {
  if (!container)
    return undefined;

  if (keys.length == 1)
    return container[keys[0]];

  return getObjectValueRecursively(container[keys.shift()], keys);
}

export function addCreationDate(changes) {
  addKeyValue(changes, '_creationDate', new Date());
}

export function addModificationDate(changes) {
  addKeyValue(changes, '_modificationDate', new Date());
}

export function addSearchChanges(changes) {
  ['firstname', 'lastname', 'email'].forEach(k => {
    const value = getValue(changes, `infos.${k}`);
    if (value) {
      addKeyValue(changes, `search.${k}`, normalizeTermForSearch(value));
    }
  });
}

export function arrayToObject(arrayChanges) {
  let objChanges = {};
  arrayChanges.forEach(x => {
    objChanges[x.key] = x.value;
  })

  return objChanges;
}
