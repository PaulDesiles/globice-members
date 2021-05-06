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
    check(data, Object);
    
    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addCreationDate(data);

    MembersCollection.insert(data);
  },


  'members.update'(memberId, data) {
    check(memberId, String);
    check(data, Array);

    ensureUserConnected(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);

    var dataObj = arrayToObject(data);

    MembersCollection.update(memberId, {
      $set: dataObj,
    });
  },
});
