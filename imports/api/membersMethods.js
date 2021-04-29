import { check } from 'meteor/check';
import { MembersCollection } from '../db/MembersCollection';

Meteor.methods({
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
