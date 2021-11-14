
function getFullPropertyName(propertyName, prefix) {
  if (prefix)
    return `${prefix}.${propertyName}`;

  return propertyName;
}

function searchFor(propertyName, searchTerm, prefix) {
  return {
      [getFullPropertyName(propertyName, prefix)] : searchTerm //{ $regex: searchTerm, $options: "i" }  << regex now useless thanks to additional search columns
  };
}

function getSearchQuery(searchTerm, properties, prefix = undefined) {
  if (!searchTerm)
    return {};

  if (typeof properties.length === "number") {
    return { 
      $or: properties.map(p => searchFor(p, searchTerm, prefix))
    };
  } else {
    return searchFor(properties, searchTerm, prefix);
  }
}

export function getMemberSearchQuery(searchTerm) {
  if (!searchTerm)
    return {};
  
  return getSearchQuery(
    searchTerm,
    searchTerm.includes('@') ? 'email' : ["lastname", "firstname", "email"],
    'search'
  );
}

export function normalizeTerm(term) {
  if (!term)
    return term;

  return term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function addSearchChanges(changesObject) {
  if (changesObject['infos.firstname'])
    changesObject['search.firstname'] = normalizeTerm(changesObject['infos.firstname']);
    
  if (changesObject['infos.lastname'])
    changesObject['search.lastname'] = normalizeTerm(changesObject['infos.lastname']);
  
  if (changesObject['infos.email'])
    changesObject['search.email'] = normalizeTerm(changesObject['infos.email']);
}

export function getMatchingMemberQuery(firstname, lastname) {
  return {
    'search.firstname' : normalizeTerm(firstname),
    'search.lastname' : normalizeTerm(lastname)
  }
}