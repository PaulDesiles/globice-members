import { check } from 'meteor/check';
import { TripsCollection } from '../db/TripsCollection';
import { 
  ensureContainsUpdates, 
  ensureUserConnected,
  addCreationDate,
  addModificationDate,
  arrayToObject 
} from './commonMethods';
import { updateMembersTripAssociation } from './membersTripsLinks';

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

    const previousApplicantsData = JSON.parse(
      JSON.stringify(
        TripsCollection.findOne(tripId).applicants
      )
    );

    const dataObj = arrayToObject(data);
    TripsCollection.update(tripId, {
      $set: dataObj,
    });

    updateMembersTripAssociation(tripId, dataObj.applicants, previousApplicantsData);
  },
  
  'trips.delete'(tripId) {
    check(tripId, String);
    ensureUserConnected(this.userId);
    
    const previousApplicantsData = JSON.parse(
      JSON.stringify(
        TripsCollection.findOne(tripId).applicants
      )
    );

    TripsCollection.remove(tripId);

    updateMembersTripAssociation(tripId, [], previousApplicantsData);
  }

});
