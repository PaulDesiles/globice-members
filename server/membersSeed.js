import fs from 'fs';
import { rawMemberFieldsConverters } from '/imports/api/memberCreationHelper';
import { normalizeTerm } from '/imports/commonHelpers/searchHelper';
import { MembersCollection } from '/imports/db/MembersCollection';

let membersSeed = [];

try {
  const data = fs.readFileSync('D:\\Docs_Globice\\donnees_2021_06_05.csv', 'utf8');

  membersSeed = data.split('\n')
    .slice(1)
    .filter(line => line)
    .map(line => {
      cells = line.split(';');

      let lastTripColumns = [
        { index: 17, date: '2021-04-04' },
        { index: 18, date: '2021-04-13' },
        { index: 19, date: '2021-04-29' },
        { index: 20, date: '2021-05-03' },
        { index: 21, date: '2021-05-10' },
        { index: 22, date: '2021-05-18' },
        { index: 23, date: '2021-05-26' },
        { index: 24, date: '2021-05-27' },
        { index: 25, date: '2021-06-01' }
      ].map(x => ({
        index: x.index,
        id: `legacy-${x.date}`,
        date: new Date(x.date)
      }));

      let oldTripsDate = new Date('2021-01-01');
      let xId = 1;

      // repeat a legacy 2021 trip x times (= old trip count)
      // and concat all recent trips with their real date
      let getTrips = (confirmed) => {
        return new Array(parseInt(cells[confirmed ? 28 : 29]))
          .fill('x')
          .map(_ => ({
            id: `legacy-2021-${xId++}`,
            legacy: true,
            date: oldTripsDate,
            credited: confirmed ? true : undefined
          }))
          .concat(
            lastTripColumns
            .filter(x => cells[x.index] === (confirmed ? 'A' : 'R'))
            .map(x => ({ 
              id: x.id,
              legacy: true,
              date: x.date,
              credited: confirmed ? true : undefined
            }))
          );
      };

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
            { id: 'legacy', size: cells[14], date: new Date('2021-06-05'), paymentInfos: 'solde au 05/06/21' }
          ].filter(p => p.size > 0),
          "confirmedTrips": getTrips(true),
          "refusedTrips": getTrips(false),
        },
        "_creationDate": new Date(),
        "_schemaVersion": "1"
      };
    });

} catch (err) {
  console.error(err);
}

export default membersSeed;


export function correctMembers() {
  MembersCollection.find({}).forEach(member => {
    let diff = member.trips.confirmedTrips.filter(t => t.legacy).length;
    if (diff > 0) {
      // let legacyPurchase = member.trips.purchases.filter(p => p.id === "legacy")[0];
      // if (legacyPurchase) {
      // }

        MembersCollection.update(memberId, 
          { $inc: { "trips.purchases.$[elem].size" : diff } },
          {
            multi: true,
            arrayFilters: [ { "elem.legacy": { $eq: true } } ],
            bypassCollection2: true
          }
        );
    }

    throw Error("let's stop there");
  });
}

export function addSearchValues() {
  MembersCollection.find({})
    .fetch()
    .forEach(member => {
      if (!member.search) {
        console.log(member._id);
        var changes = {
          search: {
            firstname: normalizeTerm(member.infos.firstname),
            lastname: normalizeTerm(member.infos.lastname),
            email: normalizeTerm(member.infos.email) 
          }
        };
        console.log(changes);
        MembersCollection.update(member._id, 
        {
          $set: changes,
        }, {
          bypassCollection2: true
        });
      }
    });
    
    console.log("done!");
}