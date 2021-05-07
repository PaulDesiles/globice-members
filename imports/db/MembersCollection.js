import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const MembersCollection = new Mongo.Collection('members');

const purchaseSchema = new SimpleSchema({
  id: String,
  size: SimpleSchema.Integer,
  date: Date,
  paymentInfos: {type: String, optional: true},
});

const tripSchema = new SimpleSchema({
  type: String, 
  regEx: SimpleSchema.RegEx.Id
});

MembersCollection.schema = new SimpleSchema({
  _schemaVersion: { type: Number, defaultValue: 1 },
  _creationDate: Date,
  _modificationDate: {type: Date, optional: true},

  infos: Object,
  "infos.firstname": String,
  "infos.lastname": String,
  "infos.birthdate": Date,
  "infos.email": String,
  "infos.phone": {type: String, optional: true},
  "infos.address": {type: String, optional: true},
  "infos.postCode": {type: String, optional: true},
  "infos.city": {type: String, optional: true},
  
  abilities: Object,
  "abilities.boatLicense": {type: String, optional: true},
  "abilities.captain": {type: String, optional: true},
  "abilities.diving": {type: String, optional: true},
  "abilities.photo": {type: String, optional: true},
  "abilities.comment": {type: String, optional: true},

  membership: Object,
  "membership.date": Date,
  "membership.isNewMember": {type: String, optional: true},
  "membership.certificate": {type: String, optional: true},

  trips: Object,
  "trips.purchases": [purchaseSchema],
  "trips.confirmedTrips": [tripSchema],
  "trips.refusedTrips": [tripSchema],
});

MembersCollection.attachSchema(MembersCollection.schema);