import { Meteor } from 'meteor/meteor';
import { MembersCollection } from '/imports/db/MembersCollection';

Meteor.publish('members', function publishMembers() {
  return MembersCollection.find({ });
});
