import { ParametersCollection } from '../db/ParametersCollection';
import { check } from 'meteor/check';
import { 
  ensureContainsUpdates, 
  ensureUserConnected,
  addModificationDate,
} from './commonMethods';

Meteor.methods({
  'parameters.update'(id, data) {
    check(id, String);
    check(data, Object);
    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    ParametersCollection.update(id, {
      $set: data,
    });
  }
});
