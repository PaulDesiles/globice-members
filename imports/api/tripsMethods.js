import { check } from 'meteor/check';
import { TripsCollection } from '../db/TripsCollection';


Meteor.methods({
  'trips.insert'(tripData) {
    check(tripData.date, Date);
    check(tripData.captain, String);
    check(tripData.port, String);
    check(tripData.type, String);
    check(tripData.renter, String);
//    check(tripData.state, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    TripsCollection.insert({
      creationDate: new Date,
      ...tripData
    });
  }
});
