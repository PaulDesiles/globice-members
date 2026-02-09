import fs from 'fs';
import { rawMemberFieldsConverters } from '/imports/api/memberCreationHelper';
import { normalizeTermForSearch } from '/imports/commonHelpers/searchHelper';
import { MembersCollection } from '/imports/db/MembersCollection';
import { TripsCollection } from '/imports/db/TripsCollection';
import { logError } from '../imports/commonHelpers/logHelper';

export function getInitCounts() {
    const data = fs.readFileSync('C:\\Users\\user\\Documents\\Dev\\globice-exports\\helloasso\\carnets_init_2.csv', 'utf8');

    return data.split('\n')
      .map(line => {
        cells = line.split(';');

        return {
          fullName: normalize(cells[0]),
          count: Number.parseInt(cells[1])
        };
      });
}

export function addTripBooksToMatchingMembers(members, initCounts) {
  const date = new Date(2021, 3, 20);
  members.forEach(m => {
    let index = initCounts.findIndex(ic => ic.fullName === normalize(`${m.infos.firstname} ${m.infos.lastname}`));

    if (index >= 0) {
      const x = initCounts[index];
      console.log(x.fullName + ' : ' + x.count);

      const tripBook = {
        "id": 'solde-initial',
        "size": x.count,
        "date": date,
        "paymentInfos": 'solde-initial'
      };
      MembersCollection.update(m._id, { $push: { 'trips.purchases': tripBook } });
    }
  });
}

export function getOldTripsBooks() {
    const data = fs.readFileSync('C:\\Users\\user\\Documents\\Dev\\globice-exports\\helloasso\\achats_cartes.csv', 'utf8');

    return data.split('\n')
      .slice(1)
      .filter(line => line)
      .map(line => {
        cells = line.split(';');

        return {
          date: rawMemberFieldsConverters['date'](cells[0]),
          lastname: normalize(cells[1]),
          firstname: normalize(cells[2]),
          email: normalize(cells[3]),
          count: Number.parseInt(cells[4])
        };
      });
}

export function addOldTripBooks(members, tripBooks) {
  members.forEach(m => {
    tripBooks.filter(b => emailComparer(m, b.email) || nameComparer(m, b.firstname, b.lastname))
      .forEach(b => {
        const tripBook = {
          "id": 'rattrapage-vieux-carnets',
          "size": b.count,
          "date": b.date,
          "paymentInfos": 'rattrapage-vieux-carnets'
        };
        
        console.log(`${m.infos.email};${m.infos.firstname};${m.infos.lastname};${b.date.toLocaleDateString()}`);
        MembersCollection.update(m._id, { $push: { 'trips.purchases': tripBook } });
      });
  });
}


export function getMemberSeed() {
  let allMembers = [];

  try {
    const creationDate =  new Date();
    const data = fs.readFileSync('C:\\Users\\user\\Documents\\Dev\\globice-exports\\adhesions.csv', 'utf8');

    allMembers = data.split('\n')
      .slice(1)
      .filter(line => line)
      .reverse() // file has older entries last
      .map(line => {
        cells = line.split(';');
        // var logs = cells.map((x, i) => `${i}: ${x}`);
        // logs.forEach(x => console.log(x));

        // let lastTripColumns = [
        //   { index: 17, date: '2021-04-04' },
        //   { index: 18, date: '2021-04-13' },
        //   { index: 19, date: '2021-04-29' },
        //   { index: 20, date: '2021-05-03' },
        //   { index: 21, date: '2021-05-10' },
        //   { index: 22, date: '2021-05-18' },
        //   { index: 23, date: '2021-05-26' },
        //   { index: 24, date: '2021-05-27' },
        //   { index: 25, date: '2021-06-01' }
        // ].map(x => ({
        //   index: x.index,
        //   id: `legacy-${x.date}`,
        //   date: new Date(x.date)
        // }));

        // let oldTripsDate = new Date('2021-01-01');
        // let xId = 1;

        // repeat a legacy 2021 trip x times (= old trip count)
        // and concat all recent trips with their real date
        // let getTrips = (confirmed) => {
        //   return new Array(parseInt(cells[confirmed ? 28 : 29]))
        //     .fill('x')
        //     .map(_ => ({
        //       id: `legacy-2021-${xId++}`,
        //       legacy: true,
        //       date: oldTripsDate,
        //       credited: confirmed ? true : undefined
        //     }))
        //     .concat(
        //       lastTripColumns
        //       .filter(x => cells[x.index] === (confirmed ? 'A' : 'R'))
        //       .map(x => ({ 
        //         id: x.id,
        //         legacy: true,
        //         date: x.date,
        //         credited: confirmed ? true : undefined
        //       }))
        //     );
        // };

        let date = rawMemberFieldsConverters['date'](cells[1]);

        var member = {
          "infos": {
            "firstname": rawMemberFieldsConverters['firstname'](cells[4]),
            "lastname": rawMemberFieldsConverters['lastname'](cells[3]),
            "birthdate": rawMemberFieldsConverters['birthdate'](cells[22]),
            "email": rawMemberFieldsConverters['email'](cells[18]),
            "phone": cells[17],
            "address": cells[19],
            "postCode": cells[20],
            "city": cells[21]
          },
          "abilities": {
            "boatLicense": rawMemberFieldsConverters['boatLicense'](cells[24]),
            "captain": cells[25],
            // "diving": rawMemberFieldsConverters['diving'](cells[12]),
            "photo": cells[26].trim(),
            "comment": ""
          },
          "membership": {
            "date": date,
            "isNewMember": rawMemberFieldsConverters['isNewMember'](cells[23]),
            "previousMemberships": []
          },
          "trips": {
            "purchases": 
              cells[15] != "Oui"
              ? []
              : [ { "id": 'rattrapage-adhesions-2024-2025', "size": 5, "date": date, "paymentInfos": 'achats 24-25' } ],
            "confirmedTrips": [], // getTrips(true),
            "refusedTrips": [], // getTrips(false),
          },
          "_creationDate": creationDate,
          "_schemaVersion": "1"
        };

        return {
          ...member,
          ...getSearchData(member)
        };
      });

  let members2024 = allMembers.filter(m => m.membership.date.getTime() < new Date(2024, 8, 1).getTime() && m.membership.date.getTime() > new Date(2023, 8, 1).getTime());
  let members2025 = allMembers.filter(m =>  m.membership.date.getTime() < new Date(2025, 8, 1).getTime() && m.membership.date.getTime() > new Date(2024, 8, 1).getTime());
  var members = [];

  // var test = members2024// allMembers.filter(x => members2024.indexOf(x) < 0 && members2025.indexOf(x) < 0);
  // console.log('nor 24 nor 25n-----');
  // test.forEach(x => console.log(`${x.infos.firstname} ${x.infos.lastname}`));
  // console.log('-----');
  // return [];

  members2024.forEach(x => {
    let index = members2025.findIndex(m => emailComparer(m, x.infos.email));

    if (index < 0) {
      index = members2025.findIndex(m => nameComparer(m, x.infos.firstname, x.infos.lastname));
    }

    if (index < 0) {
      // no membership in 2025
      members.push(x);
    } else {
      members2025[index].membership.previousMemberships.push(x.membership.date);
    }
  });

  members = [...members, ...members2025];
  
  members.forEach(x => console.log(`${x.infos.firstname} ${x.infos.lastname}`));

  let tripBooks = getTripBooks();
  tripBooks.forEach(x => {

    let index = members.findIndex(m => emailComparer(m, x.email));
    
    // if (index !== members.findLastIndex(m => emailComparer(m, x.email))) {
    //   console.log("multiple members are matching email " + x.email);
    //   return;
    // }

    if (index < 0) {
      index = members.findIndex(m => nameComparer(m, x.firstname, x.lastname));

      // if (index !== members.findLastIndex(m => nameComparer(m, x.firstname, x.lastname))) {
      //   console.log(`multiple members are matching name ${x.firstname} ${x.lastname}`);
      //   return;
      // }
    }

    if (index < 0) {
      console.log(`${x.email};${x.firstname};${x.lastname};${x.tripbook.date.toLocaleDateString()}`);
      return;
    }

    members[index].trips.purchases.push(x.tripbook);
  });

  } catch (e) {
    logError(e);
  }

  return members;
}


export function getForgottenTripBooks() {
  let allMembers = [];
  let members24And25 = [];

  try {
    const creationDate =  new Date();
    const data = fs.readFileSync('C:\\Users\\user\\Documents\\Dev\\globice-exports\\adhesions.csv', 'utf8');

    allMembers = data.split('\n')
      .slice(1)
      .filter(line => line)
      .reverse() // file has older entries last
      .map(line => {
        cells = line.split(';');

        let date = rawMemberFieldsConverters['date'](cells[1]);

        var member = {
          "infos": {
            "firstname": rawMemberFieldsConverters['firstname'](cells[4]),
            "lastname": rawMemberFieldsConverters['lastname'](cells[3]),
            "email": rawMemberFieldsConverters['email'](cells[18]),
          },
          "membership": {
            "date": date,
            "isNewMember": rawMemberFieldsConverters['isNewMember'](cells[23]),
            "previousMemberships": []
          },
          "trips": {
            "purchases": 
              cells[15] != "Oui"
              ? []
              : [ { "id": 'rattrapage-adhesions-2024-2025', "size": 5, "date": date, "paymentInfos": 'achats 24-25' } ],
            "confirmedTrips": [], // getTrips(true),
            "refusedTrips": [], // getTrips(false),
          },
          "_creationDate": creationDate,
          "_schemaVersion": "1"
        };

        return member;
      });

  let members2024 = allMembers.filter(m => m.membership.date.getTime() < new Date(2024, 8, 1).getTime() && m.membership.date.getTime() > new Date(2023, 8, 1).getTime());
  let members2025 = allMembers.filter(m =>  m.membership.date.getTime() < new Date(2025, 8, 1).getTime() && m.membership.date.getTime() > new Date(2024, 8, 1).getTime());

  members2024.forEach(x => {
    let index = members2025.findIndex(m => emailComparer(m, x.infos.email));

    if (index < 0) {
      index = members2025.findIndex(m => nameComparer(m, x.infos.firstname, x.infos.lastname));
    }

    if (index >= 0 && x.trips.purchases.length > 0) {
      members24And25.push(x);
    }
  });

  members24And25.forEach(x => {
    const t = x.trips.purchases[0];
    console.log(`${t.date.toLocaleString()};${x.infos.lastname};${x.infos.firstname};${x.infos.email};${t.size}`);
  });

  } catch (e) {
    logError(e);
  }

  return members24And25;
}


function emailComparer(member, email) {
  return member.infos.email.toLowerCase() === email.toLowerCase();
}

function nameComparer(member, firstname, lastname) {
  return normalize(member.infos.lastname) === normalize(lastname)
    && normalize(member.infos.firstname) === normalize(firstname);
}


function getTripBooks() {
  const data = fs.readFileSync('C:\\Users\\user\\Documents\\Dev\\globice-exports\\carnets.csv', 'utf8');

  return data.split('\n')
    .slice(1)
    .filter(line => line)
    .reverse() // file has older entries last
    .map(line => {
      cells = line.split(';');

      return {
        "lastname": rawMemberFieldsConverters['lastname'](cells[4]),
        "firstname": rawMemberFieldsConverters['firstname'](cells[5]),
        "email": rawMemberFieldsConverters['email'](cells[6]),
        "tripbook": {
          "id": 'rattrapage-carnets-2025',
          "size": 5,
          "date": rawMemberFieldsConverters['date'](cells[1]),
          "paymentInfos": 'achats 2025'
        }
      }
    });
}


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

function getSearchData(member) {
  var x = {
    search: {
      firstname: normalizeTermForSearch(member.infos.firstname),
      lastname: normalizeTermForSearch(member.infos.lastname),
      email: normalizeTermForSearch(member.infos.email) 
    }
  };

  return x;
}

export function addSearchValues() {
  MembersCollection.find({})
    .fetch()
    .forEach(member => {
      if (!member.search) {
        console.log(member._id);
        var changes = getSearchData(member);
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

function normalize(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function linkOldTripsToRecreatedMembers() {
  // let trips2025 = TripsCollection.find({ '_id': '6J9DBjZDQMRFSm5go'})
  let trips2425 = TripsCollection.find({ 'date': { $gt: new Date(2024, 0, 1, 0, 0 ,0) }})
      .fetch();
    let members = MembersCollection.find({})
      .fetch();
    // exclude the only surivor of The Great Destruction
    members = members.filter(m => m._id !== 'CKeKFbQfgB22kGxvA');
    
    let missingMembers = new Map();

    trips2425.forEach(trip => {
      trip.applicants.forEach(applicant => {
        var matches = members.filter(m => normalize(`${m.infos.firstname} ${m.infos.lastname}`) === normalize(applicant.memberName));

        switch (matches.length) {
          case 0:
            // console.log(`failed to find member ${applicant.memberName} for trip ${trip._id}` );
            let currentArray = missingMembers.get(applicant.memberName) ?? [];
            missingMembers.set(applicant.memberName, [...currentArray, { date: trip.date, credited: !!applicant.assignedRole && applicant.credited }]);
            break;
          case 1:
            let tripdata = {
              id: trip._id,
              date: trip.date,
              credited: applicant.credited
            };

            let update = !!applicant.assignedRole
              ? { $push: { 'trips.confirmedTrips': tripdata } }
              : { $push: { 'trips.refusedTrips': tripdata } };

            let member = matches[0];

            MembersCollection.update(
              member._id,
              update
            );

            TripsCollection.update(
              trip._id,
              { $set: { 'applicants.$[element].memberId': member._id }},
              { 
                multi: true,
                arrayFilters: [ { "element.memberName": { $eq: applicant.memberName } } ],
                bypassCollection2: true
              }
            );

            console.log(`linked trip ${trip._id} with member ${member._id} (${member.infos.firstname} ${member.infos.lastname})`);
            break;
          default:
            console.log(`multiple members matching name ${applicant.memberName} for trip ${trip._id}` );
            break;
        }
      });
    });

    console.log('-----------\nmissing members summary\n-----------');
    missingMembers.forEach((value, key) => console.log(`${key};${value
      .filter(x => x.credited)
      .map(x => x.date.toLocaleDateString())
      .join(';')
    }`));
}