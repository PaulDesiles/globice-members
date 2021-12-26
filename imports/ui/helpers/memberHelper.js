import { isTripCredited } from './tripsHelper';
import { ensureIsDate } from './dateHelper';
import { rawMemberFieldsConverters, normalize } from '../../api/memberCreationHelper';
import { addCreationDate } from '../../api/commonMethods';
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


// ********* HelloAsso import member helpers *********//

function getRawFormAnswer(formData, question) {
  const lowerQuestion = question.toLocaleLowerCase();
  return formData.customFields
    .find(field => field.name.toLocaleLowerCase() === lowerQuestion)
    ?.answer
    ?.trim();
}

function searchAndAddValueForKey(container, key, formData, parameters) {
  const raw = getRawFormAnswer(formData, parameters.newMemberForm[key]);
  if (raw) {
    const converter = rawMemberFieldsConverters[key];
    container[key] = converter ? converter(raw) :
      typeof raw === "string" ?
        raw.trim()
        : raw;
  }
}

export function createMemberFromHelloAssoForm(formData, parameters) {
  
  const member = {
    infos: {
      firstname: normalize(formData.user.firstName),
      lastname: normalize(formData.user.lastName)
    },
    abilities: {},
    membership: { 
      date: new Date()
    },
    trips: {
      purchases: [],
      confirmedTrips: [],
      refusedTrips: [],
    }
  };

  ['birthdate', 'email', 'phone', 'address', 'postCode', 'city']
    .forEach(k => searchAndAddValueForKey(member.infos, k, formData, parameters));

  ['boatLicense', 'captain', 'diving', 'photo']
    .forEach(k => searchAndAddValueForKey(member.abilities, k, formData, parameters));

  searchAndAddValueForKey(member.membership, 'isNewMember', formData, parameters);

  addCreationDate(member);

  return member;
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

export function applyEditData(memberSource, editData) {
  if (!editData)
    return memberSource;

  let date = new Date(editData.date);
  if (isNaN(date.valueOf()))
    date = new Date();
  
  let newMembership = undefined;
  let newPurchases = [];

  if (editData.renewMembership) {
    newMembership = { date: date, isNewMember: 'Non' }
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

  return member = {
    _id: memberSource._id,
    infos: getMemberInfos(memberSource.infos, editData),
    abilities: getMemberAbilities(memberSource.abilities, editData),
    membership: newMembership ?? {...memberSource.membership},
    trips: {
      purchases: [...memberSource.trips.purchases, ...newPurchases],
      confirmedTrips: [...memberSource.trips.confirmedTrips],
      refusedTrips: [...memberSource.trips.refusedTrips],
    }
  };
}