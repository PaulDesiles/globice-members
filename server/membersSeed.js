import fs from 'fs';
import { rawMemberFieldsConverters } from '/imports/api/memberCreationHelper';

let membersSeed = [];

try {
  const data = fs.readFileSync('D:\\Docs_Globice\\members2.csv', 'utf8');

  membersSeed = data.split('\n')
    .slice(1)
    .filter(line => line)
    .map(line => {
      cells = line.split(';');

      return {
        "infos": {
          "firstname": rawMemberFieldsConverters['firstname'](cells[1]),
          "lastname": rawMemberFieldsConverters['lastname'](cells[0]),
          "birthdate": rawMemberFieldsConverters['birthdate'](cells[2]),
          "email": cells[4],
          "phone": cells[3],
          "address": cells[5],
          "postCode": cells[6],
          "city": cells[7]
        },
        "abilities": {
          "boatLicense": rawMemberFieldsConverters['boatLicense'](cells[10]),
          "captain": cells[11],
          "diving": rawMemberFieldsConverters['diving'](cells[12]),
          "photo": cells[13].trim(),
          "comment": ""
        },
        "membership": {
          "date": rawMemberFieldsConverters['date'](cells[8]),
          "isNewMember": rawMemberFieldsConverters['isNewMember'](cells[9])
        },
        "trips": {
          "purchases": [
            { id: 'legacy', size: cells[14], date: new Date(), paymentInfos: 'solde au 01/06/21' }
          ].filter(p => p.size > 0),
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