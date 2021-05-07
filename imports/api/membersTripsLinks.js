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

function updateMembers(list, action) {
  list.forEach(memberId => {
    console.log(`updating ${memberId}`);
    MembersCollection.update(memberId, action)
  });
}

export function updateMembersTripAssociation(
  tripId,
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

  updateMembers(selectedOnes.add, { $push: { 'trips.confirmedTrips': tripId }});
  updateMembers(selectedOnes.delete, { $pull: { 'trips.confirmedTrips': tripId }});
  updateMembers(refusedOnes.add, { $push: { 'trips.refusedTrips': tripId }});
  updateMembers(refusedOnes.delete, { $pull: { 'trips.refusedTrips': tripId }});
}