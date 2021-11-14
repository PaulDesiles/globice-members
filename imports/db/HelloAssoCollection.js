import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const HelloAssoCollection = new Mongo.Collection('helloasso');

HelloAssoCollection.schema = new SimpleSchema({
  _id: String,
  eventType: String,
  data: Object
});

HelloAssoCollection.attachSchema(HelloAssoCollection.schema);
