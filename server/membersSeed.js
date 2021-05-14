import fs from 'fs';
import { rawMemberFieldsConverters } from '/imports/api/memberCreationHelpers';

let membersSeed = [];

try {
  const data = fs.readFileSync('C:\\Users\\Paul\\Documents\\members.csv', 'utf8');

  membersSeed = data.split('\n')
    .slice(1)
    .filter(line => line)
    .map(line => {
      cells = line.split(';');

      return {
        "infos": {
          "firstname": rawMemberFieldsConverters['firstname'](cells[7]),
          "lastname": rawMemberFieldsConverters['lastname'](cells[6]),
          "birthdate": rawMemberFieldsConverters['birthdate'](cells[11]),
          "email": cells[10],
          "phone": cells[22],
          "address": cells[24],
          "postCode": cells[25],
          "city": cells[26]
        },
        "abilities": {
          "boatLicense": cells[30],
          "captain": cells[31],
          "diving": rawMemberFieldsConverters['diving'](cells[32]),
          "photo": cells[33].trim(),
          "comment": ""
        },
        "membership": {
          "date": rawMemberFieldsConverters['date'](cells[9]),
          "isNewMember": rawMemberFieldsConverters['isNewMember'](cells[29]),
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