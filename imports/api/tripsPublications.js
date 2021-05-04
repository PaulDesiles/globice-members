import { Meteor } from 'meteor/meteor';
import { TripsCollection } from '/imports/db/TripsCollection';

Meteor.publish('trips', function publishTrips() {
  return TripsCollection.find({ }); // , { sort: { 'date': 1 }
});
