import { check } from 'meteor/check';
import { MembersCollection } from '../db/MembersCollection';
import { 
  ensureContainsUpdates, 
  ensureIsAdmin,
  addCreationDate,
  addModificationDate,
  addSearchChanges,
  arrayToObject
} from './commonMethods';
import { logMessage } from '../commonHelpers/logHelper';

Meteor.methods({
  'members.create'(data) {
    check(data, Object);
    
    ensureIsAdmin(this.userId);
    ensureContainsUpdates(data);

    addCreationDate(data);
    addSearchChanges(data);

    MembersCollection.insert(data);
  },


  'members.update'(memberId, data) {
    check(memberId, String);
    check(data, Array);

    ensureIsAdmin(this.userId);
    ensureContainsUpdates(data);

    addModificationDate(data);
    addSearchChanges(data);

    let dataObj = arrayToObject(data);
    MembersCollection.update(memberId, {
      $set: dataObj
    });
  },

  'members.delete'(memberId) {
    check(memberId, String);
    ensureIsAdmin(this.userId);
    MembersCollection.remove(memberId);
  },

  'members.oldMembership.cleanup'(maxDate) {
    check(maxDate, Date);
    ensureIsAdmin(this.userId);
    logMessage(`clean members with membership older than ${maxDate.toISOString()}`);

    MembersCollection.remove({
      'membership.date': { $lt: maxDate }
    });
  },
});
