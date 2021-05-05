import { check } from 'meteor/check';
import { MembersCollection } from '../db/MembersCollection';
import { 
  ensureContainsUpdates, 
  ensureUserConnected,
  addCreationDate,
  addModificationDate,
  arrayToObject 
} from './commonMethods';

Meteor.methods({
  'members.create'(data) {
    check(data, Array);
    
    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addCreationDate(data);

    MembersCollection.insert(arrayToObject(data));
  },


  'members.update'(memberId, data) {
    check(memberId, String);
    check(data, Array);

    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    MembersCollection.update(memberId, {
      $set: arrayToObject(data),
    });
  },
});
