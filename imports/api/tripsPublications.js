import { Meteor } from 'meteor/meteor';
import { TripsCollection } from '/imports/db/TripsCollection';
import { ensureCanViewData } from './commonMethods';

Meteor.publish('trips', function publishTrips() {
  if (ensureCanViewData(this.userId)) {
    return TripsCollection.find({ }); // , { sort: { 'date': 1 }
  }

  this.stop();
});
