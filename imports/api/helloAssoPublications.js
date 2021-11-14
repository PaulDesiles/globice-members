import { Meteor } from 'meteor/meteor';
import { HelloAssoCollection } from '/imports/db/HelloAssoCollection';
import { ensureCanViewData } from './commonMethods';

Meteor.publish('helloasso', function publishHelloAsso() {
  ensureCanViewData(this.userId);
  return HelloAssoCollection.find({ }, { sort: { 'data.date': -1 }});
});
