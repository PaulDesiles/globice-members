import { ParametersCollection } from '../db/ParametersCollection';
import { 
  ensureContainsUpdates, 
  ensureUserConnected,
  addModificationDate,
} from './commonMethods';

Meteor.methods({
  'trips.update'(id, data) {
    check(data, Array);
    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    TripsCollection.update(id, {
      $set: data,
    });
  }
});
