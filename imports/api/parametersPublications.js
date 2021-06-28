import { Meteor } from 'meteor/meteor';
import { ParametersCollection } from '/imports/db/ParametersCollection';
import { ensureCanViewData } from './commonMethods';

Meteor.publish('parameters', function publishParameters() {
  ensureCanViewData(this.userId);
  return ParametersCollection.find({});
});
