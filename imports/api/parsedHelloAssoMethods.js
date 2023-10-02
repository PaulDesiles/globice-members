import { check } from 'meteor/check';
import { HelloAssoCollection } from '../db/HelloAssoCollection';
import { ParsedHelloAssoCollection } from '../db/ParsedHelloAssoCollection';
import { ParametersCollection } from '../db/ParametersCollection';
import { ensureIsAdmin } from './commonMethods';
import { parseHelloAssoEntries } from '../commonHelpers/helloassoHelper';
import { logMessage } from '../commonHelpers/logHelper';

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

    logMessage(`${newEntries.length} new entries found`);

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

    logMessage(`resolve id ${id}`);

    ParsedHelloAssoCollection.update(
      { _id: id },
      { $set: { resolved: true } }
    );
  },

  'parsedhelloasso.reopen'(id) {
    check(id, String);
    ensureIsAdmin(this.userId);

    logMessage(`reopen id ${id}`);

    ParsedHelloAssoCollection.update(id, {
      $set: { resolved: false }
    });
  },

  'parsedhelloasso.cleanup'() {
    ensureIsAdmin(this.userId);

    var d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    var maxDate = d.toISOString();

    logMessage(`clean HelloAsso and resolved ParsedHelloAsso entries older than ${maxDate}`);

    HelloAssoCollection.remove({
      'data.date': { $lt: maxDate }
    });

    ParsedHelloAssoCollection.remove({
      $and: [
        { resolved: true },
        { date: { $lt: maxDate } }
      ]
    });
  },
});