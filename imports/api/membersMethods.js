import { check } from 'meteor/check';
import { MembersCollection } from '../db/MembersCollection';

Meteor.methods({
  'members.updateProperties'(memberId, changes) {
    check(memberId, String);
    check(changes, Array);

    if (changes.length === 0)
      throw new Meteor.Error('No values to update');

    // transform array into object
    let objChanges = {};
    changes.forEach(x => {
      objChanges[x.key] = x.value;
    })
    objChanges['modificationDate'] = new Date(Date.now());

    MembersCollection.update(memberId, {
      $set: objChanges,
    });
  },

  'members.insert'(memberData) {

    check(memberData.infos, Object);
    check(memberData.abilities, Object);
    check(memberData.membership, Object);
    check(memberData.trips, Object);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    MembersCollection.insert({
      creationDate: new Date,
      ...memberData
    });
  },

  'members.remove'(memberId) {
    check(memberId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    MembersCollection.remove(memberId);
  },

});
