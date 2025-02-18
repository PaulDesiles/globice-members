import { check } from 'meteor/check';
import { TripsCollection } from '../db/TripsCollection';
import { 
  ensureContainsUpdates, 
  ensureCanEditTrips,
  ensureIsAdmin,
  addCreationDate,
  addModificationDate,
  arrayToObject 
} from './commonMethods';
import { logMessage } from '../commonHelpers/logHelper';

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
  },

  'trips.cleanApplicants'(maxDate) {
    check(maxDate, Date);
    ensureIsAdmin(this.userId);
    logMessage(`clean trips' applicants older than ${maxDate.toISOString()}`);

    TripsCollection.update(
      {
        $and: [
          { _anonymized: null },
          { date: { $lt: maxDate } }
        ]
      },
      { $set: { 
        applicants: [],
        _anonymized: true
      }}
    );

    // const target = TripsCollection.find({
    //   $and: [
    //     { _anonymized: null },
    //     { date: { $lt: maxDate } }
    //   ]
    // }).fetch();
    // const totalCount = TripsCollection.find().count();

    // logMessage(`trips: ${target.length} / ${totalCount}. eg: ${target.splice(0, 5).map(x => x._id).join(',')}`);

  },

  // 'trips.cleanup'(maxDate) {
  //   ensureIsAdmin(this.userId);
  //   logMessage(`clean trips older than ${maxDate.toISOString()}`);
    
  //   TripsCollection.remove({
  //     date: { $lt: maxDate }
  //   });
  // }
});
