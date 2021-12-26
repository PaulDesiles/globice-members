import { Meteor } from 'meteor/meteor';
import { HelloAssoCollection } from '/imports/db/HelloAssoCollection';
import { ensureCanViewData, ensureIsAdmin } from './commonMethods';

Meteor.publish('helloasso', function publishHelloAsso() {
  ensureCanViewData(this.userId);
  ensureIsAdmin(this.userId);
  return HelloAssoCollection.find({ eventType: 'Order' }, { sort: { 'data.date': -1 }});
});
