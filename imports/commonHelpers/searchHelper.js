
function getFullPropertyName(propertyName, prefix) {
  if (prefix)
    return `${prefix}.${propertyName}`;

  return propertyName;
}

function searchFor(propertyName, searchTerm, prefix) {
  return {
      [getFullPropertyName(propertyName, prefix)] : { $regex: searchTerm /*, $options: "i"*/ }
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
  
  var term = normalizeTerm(searchTerm);
  
  return getSearchQuery(
    term,
    term.includes('@') ? ['email'] : ["lastname", "firstname", "email"],
    'search'
  );
}

export function normalizeTerm(term) {
  if (!term)
    return term;

  return term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function getMatchingMemberQuery(firstname, lastname) {
  return {
    'search.firstname' : normalizeTerm(firstname),
    'search.lastname' : normalizeTerm(lastname)
  }
}