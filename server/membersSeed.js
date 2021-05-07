import fs from 'fs';

let membersSeed = [];

try {
  const data = fs.readFileSync('C:\\Users\\Paul\\Documents\\members.csv', 'utf8');

  const normalize = input => {
    return [input[0].toUpperCase(), ...input.toLowerCase().slice(1)].join('');
  };

  const getDate = input => {
    const dateParts= input
      ?.split(' ')[0]
      ?.split('/')
      .map(x => parseInt(x));
    
    if (!dateParts && dateParts.length !== 3)
      return undefined;
    
    const d = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0], 0, 0, 0));
    return d;
  };

  membersSeed = data.split('\n')
    .slice(1)
    .filter(line => line)
    .map(line => {
      cells = line.split(';');

      return {
        "infos": {
          "firstname": normalize(cells[7]),
          "lastname": normalize(cells[6]),
          "birthdate": getDate(cells[11]),
          "email": cells[10],
          "phone": cells[22],
          "address": cells[24],
          "postCode": cells[25],
          "city": cells[26]
        },
        "abilities": {
          "boatLicense": cells[30],
          "captain": cells[31],
          "diving": cells[32].replace('NI', 'Ni'),
          "photo": cells[33].trim(),
          "comment": ""
        },
        "membership": {
          "date": getDate(cells[9]),
          "isNewMember": cells[29] === 'une primo-adhésion' ? 'Oui' : 'Non',
          "certificate": cells[12]
        },
        "trips": {
          "purchases": [],
          "confirmedTrips": [],
          "refusedTrips": []
        },
        "_creationDate": new Date(),
        "_schemaVersion": "1"
      };
    });

} catch (err) {
  console.error(err);
}

export default membersSeed;