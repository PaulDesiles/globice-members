import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ParametersCollection = new Mongo.Collection('parameters');

const choiceSchema = new SimpleSchema({
  label: String,
  value: { type: SimpleSchema.oneOf(String, Number), optional: true }
})

ParametersCollection.schema = new SimpleSchema({
  _schemaVersion: { type: Number, defaultValue: 1 },
  _modificationDate: {type: Date, optional: true},

  trip: Object,
  'trip.captain' : [choiceSchema],
  'trip.type' : [choiceSchema],
  'trip.port' : [choiceSchema],
  'trip.renter' : [choiceSchema],
  'trip.roles' : [choiceSchema],

  member: Object,
  'member.boatLicense' : [choiceSchema],
  'member.captain' : [choiceSchema],
  'member.diving' : [choiceSchema],
  'member.photo' : [choiceSchema],
  'member.newMember' : [choiceSchema],
  'member.bookSizeChoices': [choiceSchema]
});

ParametersCollection.attachSchema(ParametersCollection.schema);