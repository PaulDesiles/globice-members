import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CleaningRunsCollection = new Mongo.Collection('cleaning-runs');

CleaningRunsCollection.schema = new SimpleSchema({
  date: { type: Date, optional: false }
});

CleaningRunsCollection.attachSchema(CleaningRunsCollection.schema);
