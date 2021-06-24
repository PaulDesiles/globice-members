import { check } from 'meteor/check';
import { TripsCollection } from '../db/TripsCollection';
import { 
  ensureContainsUpdates, 
  ensureCanEditTrips,
  addCreationDate,
  addModificationDate,
  arrayToObject 
} from './commonMethods';

import * as denormalizer from './denormalizer';

Meteor.methods({
  'trips.create'(data) {
    check(data, Array);

    ensureCanEditTrips(this.userId);
    ensureContainsUpdates(data);

    addCreationDate(data);

    const dataObj = arrayToObject(data);
    const id = TripsCollection.insert(dataObj);

    denormalizer.onApplicantsListChanged(
      { 
        id,
        date: dataObj.date
      },
      dataObj.applicants, 
      []
    );
  },

  'trips.update'(tripId, data) {
    check(tripId, String);
    check(data, Array);

    ensureCanEditTrips(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    const previousData = TripsCollection.findOne(tripId);
    const previousApplicantsData = JSON.parse(JSON.stringify(previousData.applicants));
    const previousDate = previousData.date;

    const dataObj = arrayToObject(data);
    TripsCollection.update(tripId, {
      $set: dataObj,
    });

    if (dataObj.date) {
      denormalizer.onTripDateChanged(tripId, dataObj.date, dataObj.applicants || previousApplicantsData);
    }

    if (dataObj.applicants) {
      denormalizer.onApplicantsListChanged(
        {
          id: tripId,
          date: dataObj.date || previousDate
        },
        dataObj.applicants,
        previousApplicantsData
      );
    }
  },
  
  'trips.delete'(tripId) {
    check(tripId, String);
    ensureCanEditTrips(this.userId);
    
    const previousApplicantsData = JSON.parse(
      JSON.stringify(
        TripsCollection.findOne(tripId).applicants
      )
    );

    TripsCollection.remove(tripId);

    denormalizer.onApplicantsListChanged({ id: tripId }, [], previousApplicantsData);
  }

});
