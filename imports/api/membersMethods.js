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

    // const target = MembersCollection.find({
    //   'membership.date': { $lt: maxDate }
    // }).fetch();
    // const totalCount = MembersCollection.find().count();

    // logMessage(`members: ${target.length} / ${totalCount}. eg: ${target.splice(0, 5).map(x => x._id).join(',')}`);

  },
});
