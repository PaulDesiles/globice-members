import { check } from 'meteor/check';
import { HelloAssoCollection } from '../db/HelloAssoCollection';
import { ParsedHelloAssoCollection } from '../db/ParsedHelloAssoCollection';
import { ParametersCollection } from '../db/ParametersCollection';
import { ensureIsAdmin } from './commonMethods';
import { parseHelloAssoEntries } from '../commonHelpers/helloassoHelper';

Meteor.methods({
  'parsedhelloasso.parsenewentries'() {
    ensureIsAdmin(this.userId);

    var rawEntries = HelloAssoCollection.find({
      $and: [
        { eventType: 'Order' },
        { parsed: null }
      ]
    })
    .fetch();

    var parameters = ParametersCollection.findOne({});
    var newEntries = parseHelloAssoEntries(rawEntries, parameters);

    console.log(`${newEntries.length} new entries found`);

    if (newEntries.length > 0) {
      newEntries.forEach(e => {
        ParsedHelloAssoCollection.insert(
          e,
          { bypassCollection2: true }
        );
      });

      HelloAssoCollection.update(
        { _id: { $in : rawEntries.map(e => e._id) }},
        { $set: { parsed: true }},
        { multi: true, bypassCollection2: true }
      );
    }
  },

  'parsedhelloasso.resolve'(id) {
    check(id, String);
    ensureIsAdmin(this.userId);

    ParsedHelloAssoCollection.update(
      { _id: id },
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
