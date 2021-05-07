import { check } from 'meteor/check';
import { TripsCollection } from '../db/TripsCollection';
import { 
  ensureContainsUpdates, 
  ensureUserConnected,
  addCreationDate,
  addModificationDate,
  arrayToObject 
} from './commonMethods';

function checkTrip(t) {
  check(t.date, Date);
  check(t.captain, String);
  check(t.port, String);
  check(t.type, String);
  check(t.renter, String);
  check(t.applicants, Array);
}

Meteor.methods({
  'trips.create'(data) {
    check(data, Array);

    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addCreationDate(data);

    var dataObj = arrayToObject(data);
    checkTrip(dataObj);

    TripsCollection.insert(dataObj);
  },

  'trips.update'(tripId, data) {
    check(tripId, String);
    check(data, Array);

    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    var dataObj = arrayToObject(data);

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
