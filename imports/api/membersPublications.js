import { Meteor } from 'meteor/meteor';
import { MembersCollection } from '/imports/db/MembersCollection';

Meteor.publish('members', function publishTasks() {
  return MembersCollection.find({ });
});
