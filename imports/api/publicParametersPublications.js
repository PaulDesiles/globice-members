import { Meteor } from 'meteor/meteor';
import { PublicParametersCollection } from '/imports/db/PublicParametersCollection';

Meteor.publish('public-parameters', function publishPublicParameters() {
  return PublicParametersCollection.find({});
});
