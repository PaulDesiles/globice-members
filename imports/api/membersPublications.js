import { Meteor } from 'meteor/meteor';
import { MembersCollection } from '/imports/db/MembersCollection';
import { ensureCanViewData } from './commonMethods';

Meteor.publish('members', function publishMembers() {
  ensureCanViewData(this.userId);
  return MembersCollection.find({ }, { sort: { 'infos.lastname': 1 }});
});
