import { ParametersCollection } from '../db/ParametersCollection';
import { check } from 'meteor/check';
import { 
  ensureContainsUpdates, 
  ensureIsAdmin,
  addModificationDate,
} from './commonMethods';

Meteor.methods({
  'parameters.update'(id, data) {
    check(id, String);
    check(data, Object);
    ensureIsAdmin(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    ParametersCollection.update(id, {
      $set: data,
    });
  }
});
