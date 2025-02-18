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

  'parsedhelloasso.cleanup'(maxDate) {
    check(maxDate, Date);
    ensureIsAdmin(this.userId);
    const maxDateString = maxDate.toISOString();
    logMessage(`clean resolved ParsedHelloAsso entries older than ${maxDateString}`);

    ParsedHelloAssoCollection.remove({
      $and: [
        { resolved: true },
        { date: { $lt: maxDateString } }
      ]
    });

    // const target = ParsedHelloAssoCollection.find({
    //   $and: [
    //     { resolved: true },
    //     { date: { $lt: maxDateString } }
    //   ]
    // }).fetch();
    // const totalCount = ParsedHelloAssoCollection.find().count();

    // logMessage(`parsedHelloAsso: ${target.length} / ${totalCount}. eg: ${target.splice(0, 5).map(x => x._id).join(',')}`);
  },

  'helloasso.cleanup'(maxDate) {
    check(maxDate, Date);
    ensureIsAdmin(this.userId);
    const maxDateString = maxDate.toISOString();
    logMessage(`clean HelloAsso entries older than ${maxDateString}`);

    HelloAssoCollection.remove({
      'data.date': { $lt: maxDateString }
    });

    // const target = HelloAssoCollection.find({
    //   'data.date': { $lt: maxDateString }
    // }).fetch();
    // const totalCount = HelloAssoCollection.find().count();

    // logMessage(`helloAsso: ${target.length} / ${totalCount}. eg: ${target.splice(900, 5).map(x => x._id).join(',')}`);
  },

});