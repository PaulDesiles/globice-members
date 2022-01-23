import { isTripCredited } from './tripsHelper';
import { ensureIsDate } from './dateHelper';
import { v4 as uuidv4 } from 'uuid';

const pivotMembershipDate = Date.UTC(new Date().getUTCFullYear() - 1, 4, 1,0, 0, 0);

export function isMembershipUpToDate(date) {
  return ensureIsDate(date) > pivotMembershipDate;
}

export function getTotalTripsBought(purchases) {
  return purchases.reduce((prev, cur) => prev + cur.size, 0);
}

export function getTripsLeft(memberId, purchases, confirmedTrips) {
  const bought = getTotalTripsBought(purchases);
  const consumed = confirmedTrips
    .filter(t => isTripCredited(t, memberId))
    .length;

  return Math.max(0, bought - consumed);
}

// ********* member init from query arguments *********//

function mixSourceAndEditData(source, editData, propNames) {
  var output = {...source};
  propNames.forEach(prop => {
    var value = editData[prop];
    if (value)
      output[prop] = value;
  });

  return output;
}

function getMemberInfos(source, editData) {
  var output = mixSourceAndEditData(
    source,
    editData, 
    ['lastname', 'firstname', 'email', 'phone', 'address', 'postCode', 'city']
  );

  if (editData.birthdate) {
    var d = new Date(editData.birthdate);
    if (!isNaN(d.valueOf())) {
      output.birthdate = d;
    }
  }

  return output;
}

function getMemberAbilities(source, editData) {
  return mixSourceAndEditData(source, editData, ['boatLicense', 'captain', 'diving', 'photo']);
}

// be carefull : booleans are not parsed here
export function applyEditData(memberSource, editData) {
  if (!editData)
    return memberSource;

  let date = new Date(editData.date);
  if (isNaN(date.valueOf()))
    date = new Date();
  
  let membership = undefined;
  let newPurchases = [];

  if (editData.renewMembership === "true") {
    membership = {
      date: date,
      isNewMember: memberSource?.membership?.date ? 'Non' : 'Oui',
      previousMemberships: memberSource.membership.previousMemberships ?
        [...memberSource.membership.previousMemberships]
        : []
    };

    if (memberSource.membership.date) {
      membership.previousMemberships.push(memberSource.membership.date);
    }
  } else {
    membership = { ...memberSource.membership };
  }

  if (!membership.date) {
    membership.date = new Date(); // member creation without editdata
  }
  
  if (editData.tripBooks) {
    var size = parseInt(editData.tripBooks);
    if (size && !isNaN(size)) {
      newPurchases.push({
        id: uuidv4(),
        size: size,
        date: date,
        autoAdded: true
      });
    }
  }

  return {
    _id: memberSource._id,
    infos: getMemberInfos(memberSource.infos, editData),
    abilities: getMemberAbilities(memberSource.abilities, editData),
    membership: membership,
    trips: {
      purchases: [...memberSource.trips.purchases, ...newPurchases],
      confirmedTrips: [...memberSource.trips.confirmedTrips],
      refusedTrips: [...memberSource.trips.refusedTrips],
    }
  };
}