import { check } from 'meteor/check';
import { HelloAssoCollection } from '../db/HelloAssoCollection';
import { ensureIsAdmin } from './commonMethods';

Meteor.methods({
  'helloasso.resolve'(helloAssoId) {
    // ! \\ we need helloAssoId (x.data.id) and not mongoId (x._id) !
    // it allows to resolve all duplicates
    check(helloAssoId, Number);
    ensureIsAdmin(this.userId);

    HelloAssoCollection.update(
      { 'data.id': helloAssoId },
      { $set: { resolved: true } },
      { multi: true }
    );
  },
  'helloasso.reopen'(id) {
    check(id, String);
    ensureIsAdmin(this.userId);

    HelloAssoCollection.update(id, {
      $set: { resolved: false }
    });
  },
});
