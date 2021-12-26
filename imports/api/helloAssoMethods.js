import { check } from 'meteor/check';
import { HelloAssoCollection } from '../db/HelloAssoCollection';
import { ensureIsAdmin } from './commonMethods';

Meteor.methods({
  'helloasso.resolve'(id) {
    check(id, String);
    ensureIsAdmin(this.userId);
console.log("resolve " + id);
    HelloAssoCollection.update(id, {
      $set: { resolved: true }
    });
  },
  'helloasso.reopen'(id) {
    check(id, String);
    ensureIsAdmin(this.userId);

    HelloAssoCollection.update(id, {
      $set: { resolved: false }
    });
  },
});
