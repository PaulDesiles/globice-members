import { Meteor } from 'meteor/meteor';
import { ParsedHelloAssoCollection } from '/imports/db/ParsedHelloAssoCollection';
import { ensureCanViewData, ensureIsAdmin } from './commonMethods';

Meteor.publish('parsedhelloasso', function publishHelloAsso() {
  ensureCanViewData(this.userId);
  ensureIsAdmin(this.userId);
  return ParsedHelloAssoCollection.find({}, { sort: { 'date': -1 }});
});
