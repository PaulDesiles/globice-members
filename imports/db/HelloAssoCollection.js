import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const HelloAssoCollection = new Mongo.Collection('helloasso');

// HelloAssoCollection.schema = new SimpleSchema({
//   eventType: String,
// });

// HelloAssoCollection.attachSchema(HelloAssoCollection.schema);