import { Meteor } from 'meteor/meteor';
import { ParametersCollection } from '/imports/db/ParametersCollection';

Meteor.publish('parameters', function publishParameters() {
  return ParametersCollection.findOne({});
});
