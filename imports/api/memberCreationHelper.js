
export const normalize = input => {
  if (!input)
    return undefined;

  let trimmedInput = input.trim();
    
  return [trimmedInput[0].toUpperCase(), ...trimmedInput.toLowerCase().slice(1)].join('');
};

export const getDate = input => {
  const dateParts= input
    ?.split(' ')[0]
    ?.split('/')
    .map(x => parseInt(x));
  
  if (!dateParts && dateParts.length !== 3)
    return undefined;
  
  const d = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0], 0, 0, 0));
  if (isNaN(d))
    return undefined;

  return d;
};

export const rawMemberFieldsConverters = {
  firstname: normalize,
  lastname: normalize,
  birthdate: getDate,
  boatLicense: x => {
    const low = x.toLowerCase();
    if (low === 'non') return 'Non';
    if (low.includes("hauturier")) return "Hauturier";
    return "Côtier";
  },
  diving: normalize,
  date: getDate,
  isNewMember: x => x.toLowerCase().includes("primo") ? 'Oui' : 'Non'
};