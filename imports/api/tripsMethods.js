import { check } from 'meteor/check';
import { TripsCollection } from '../db/TripsCollection';
import { MembersCollection } from '../db/MembersCollection';
import { 
  ensureContainsUpdates, 
  ensureUserConnected,
  addCreationDate,
  addModificationDate,
  arrayToObject 
} from './commonMethods';


function segregate(applicants) {
  return {
    selected: curApplicants.filter(a => a.assignedRole).map(a => a.memberId),
    refused: curApplicants.filter(a => !a.assignedRole).map(a => a.memberId)
  };
}

function getDelta(cur, prev) {
  return {
    add: cur.filter(n => prev.some(p => p !== n)),
    delete: prev.filter(n => cur.some(p => p !== n)),
  };
}

function updateMembersTripAssociation(
  tripId,
  currentApplicants,
  previousApplicants)
{
  const current = segregate(currentApplicants);
  const previous = segregate(previousApplicants);
  const selectedOnes = getDelta(current.selected, previous.selected);
  const refusedOnes = getDelta(current.refused, previous.refused);

  const membersToUpdate = [
    ...selectedOnes.add,
    ...selectedOnes.delete,
    ...refusedOnes.add,
    ...refusedOnes.delete
  ];

  MembersCollection
    .find({_id: {$in: membersToUpdate }})
    .forEach(member => {
      if (selectedOnes.add.some(id => id === member._id)) {
        member.trips.confirmedTrips.push(tripId);
      } 
      
      if (selectedOnes.delete.some(id => id === member._id)) {
        member.trips.confirmedTrips.remove(tripId);
      } 
      
      if (refusedOnes.add.some(id => id === member._id)) {
        member.trips.refusedTrips.push(tripId);
      } 
      
      if (refusedOnes.delete.some(id => id === member._id)) {
        member.trips.refusedTrips.remove(tripId);
      }
    });
}


Meteor.methods({
  'trips.create'(data) {
    check(data, Array);

    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addCreationDate(data);

    const dataObj = arrayToObject(data);
    const id = TripsCollection.insert(dataObj);

    updateMembersTripAssociation(id, dataObj.applicants, []);
  },

  'trips.update'(tripId, data) {
    check(tripId, String);
    check(data, Array);

    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    const previousData = TripsCollection.find(tripId);

    const dataObj = arrayToObject(data);
    TripsCollection.update(tripId, {
      $set: dataObj,
    });
  },
  
  'trips.delete'(tripId) {
    check(tripId, String);
    ensureUserConnected(this.userId);
    TripsCollection.remove(tripId);
  }

});
