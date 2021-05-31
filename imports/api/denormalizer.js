import { MembersCollection } from '../db/MembersCollection';

function segregate(applicants) {
  return {
    selected: applicants.filter(a => a.assignedRole).map(a => a.memberId),
    refused: applicants.filter(a => !a.assignedRole).map(a => a.memberId)
  };
}

function getDelta(cur, prev) {
  return {
    add: cur.filter(n => !prev.some(p => p === n)),
    delete: prev.filter(n => !cur.some(p => p === n)),
  };
}

function updateMembers(list, action, options = undefined) {
  list.forEach(memberId => {
    console.log(`updating ${memberId}`);
    MembersCollection.update(memberId, action, options);
  });
}

function getFullTripData(commonTripData, memberId, applicants) {
  return {
    ...commonTripData,
    credited: applicants.find(a => a.memberId === memberId).credited
  }
}

export function onApplicantsListChanged(
  tripData,
  currentApplicants,
  previousApplicants)
{
  console.log('updating members');
  console.log(currentApplicants);
  console.log(previousApplicants);

  const current = segregate(currentApplicants);
  const previous = segregate(previousApplicants);
  const selectedOnes = getDelta(current.selected, previous.selected);
  const refusedOnes = getDelta(current.refused, previous.refused);

  console.log('deltas :');
  console.log(selectedOnes);
  console.log(refusedOnes);

  // updateMembers(selectedOnes.add, { $push: { 'trips.confirmedTrips': tripData }});

  current.selected.forEach(memberId => {
    // delete previous if any to update it
    MembersCollection.update(memberId, { $pull: { 'trips.confirmedTrips': { id: tripData.id }}});
    let data = getFullTripData(tripData, memberId, currentApplicants);
    MembersCollection.update(memberId, { $push: { 'trips.confirmedTrips': data }});
  });
  
  updateMembers(selectedOnes.delete, { $pull: { 'trips.confirmedTrips': { id: tripData.id }}});
  updateMembers(refusedOnes.add, { $push: { 'trips.refusedTrips': tripData }});
  updateMembers(refusedOnes.delete, { $pull: { 'trips.refusedTrips': { id: tripData.id }}});
}

export function onTripDateChanged(id, date, applicants) {
  const ids = applicants.map(a => a.memberId);
  console.log(`update date for trip ${id} on the applicants ${ids.join(',')}`);

  updateMembers(ids, 
    { $set: {
      'trips.confirmedTrips.$[changedTrip].date': date, 
      'trips.refusedTrips.$[changedTrip].date': date, 
    }},
    {
      multi: true,
      arrayFilters: [ { "changedTrip.id": id } ],
      bypassCollection2: true
    });  
}

export function onCreditedChange(tripId, memberId, credited) {
  console.log(`update credited for trip ${tripId} on applicants ${memberId}`);
  updateMembers([id], 
    { $set: {
      'trips.confirmedTrips.$[changedTrip].credited': credited,
    }},
    {
      multi: true,
      arrayFilters: [ { "changedTrip.id": id } ],
      bypassCollection2: true
    }); 
}
