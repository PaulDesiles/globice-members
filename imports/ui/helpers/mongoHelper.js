
function getFullPropertyName(propertyName, prefix) {
  if (prefix)
    return `${prefix}.${propertyName}`;

  return propertyName;
}

function searchFor(propertyName, searchTerm, prefix) {
  return {
      [getFullPropertyName(propertyName, prefix)] : { $regex: searchTerm, $options: "i" }
  };
}

export function getSearchQuery(searchTerm, properties, prefix = undefined) {
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
    'infos'
  );
}