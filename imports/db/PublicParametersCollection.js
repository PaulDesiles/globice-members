import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PublicParametersCollection = new Mongo.Collection('public-parameters');

PublicParametersCollection.schema = new SimpleSchema({
  showDemoCredentials: { type: Boolean, optional: true }
});

PublicParametersCollection.attachSchema(PublicParametersCollection.schema);

export function getPublicParameters() {
  return PublicParametersCollection.findOne({});
};