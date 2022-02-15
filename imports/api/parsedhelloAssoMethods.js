import { check } from 'meteor/check';
import { HelloAssoCollection } from '../db/HelloAssoCollection';
import { ParsedHelloAssoCollection } from '../db/ParsedHelloAssoCollection';
import { ensureIsAdmin } from './commonMethods';
import { parseHelloAssoEntries } from '../commonHelpers/helloassoHelper';

Meteor.methods({
  'parsedhelloasso.parsenewentries'() {
    ensureIsAdmin(this.userId);

    var rawEntries = HelloAssoCollection.find({ parsed: false })
      .fetch();

    var newEntries = parseHelloAssoEntries(rawEntries);

    if (newEntries.length > 0) {
      ParsedHelloAssoCollection.insert(newEntries);

      HelloAssoCollection.update(
        { _id: { $in : rawEntries.map(e => e._id) }},
        { $set: { parsed: true }},
        { multi: true }
      );
    }
  },

  'parsedhelloasso.resolve'(id) {
    check(id, String);
    ensureIsAdmin(this.userId);

    ParsedHelloAssoCollection.update(
      { _id: helloAssoId },
      { $set: { resolved: true } }
    );
  },

  'parsedhelloasso.reopen'(id) {
    check(id, String);
    ensureIsAdmin(this.userId);

    ParsedHelloAssoCollection.update(id, {
      $set: { resolved: false }
    });
  },
});
