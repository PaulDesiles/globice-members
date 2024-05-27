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
  id: String,
  date: Date,
  credited: {type: Boolean, optional: true},
  legacy:{type: Boolean, optional: true}
});

export const memberBase = {
  infos: Object,
  "infos.firstname": String,
  "infos.lastname": String,
  "infos.birthdate": {type: Date, optional: true},
  "infos.email": {type: String, optional: true},
  "infos.phone": {type: String, optional: true},
  "infos.address": {type: String, optional: true},
  "infos.postCode": {type: String, optional: true},
  "infos.city": {type: String, optional: true},
  
  abilities: Object,
  "abilities.boatLicense": {type: String, optional: true}, // replaced by omega
  "abilities.captain": {type: String, optional: true}, // replaced by dataManager
  "abilities.diving": {type: String, optional: true}, // replaced by nemmo
  "abilities.photo": {type: String, optional: true},
  "abilities.comment": {type: String, optional: true},
  "abilities.nemmo": {type: String, optional: true},
  "abilities.omega": {type: String, optional: true},
  "abilities.dataManager": {type: String, optional: true},
};

MembersCollection.schema = new SimpleSchema({
  _schemaVersion: { type: Number, defaultValue: 1 },
  _creationDate: Date,
  _modificationDate: {type: Date, optional: true},

  ...memberBase,

  infos: Object,
  "infos.firstname": String,
  "infos.lastname": String,
  "infos.birthdate": {type: Date, optional: true},
  "infos.email": {type: String, optional: true},
  "infos.phone": {type: String, optional: true},
  "infos.address": {type: String, optional: true},
  "infos.postCode": {type: String, optional: true},
  "infos.city": {type: String, optional: true},
  
  abilities: Object,
  "abilities.boatLicense": {type: String, optional: true},
  "abilities.captain": {type: String, optional: true},
  "abilities.diving": {type: String, optional: true},
  "abilities.nemmo": {type: String, optional: true},
  "abilities.photo": {type: String, optional: true},
  "abilities.comment": {type: String, optional: true},

  membership: Object,
  "membership.date": {type: Date, optional: true},
  "membership.isNewMember": {type: String, optional: true},
  "membership.previousMemberships": [{ type: Date }],

  trips: Object,
  "trips.purchases": [purchaseSchema],
  "trips.confirmedTrips": [tripSchema],
  "trips.refusedTrips": [tripSchema],

  "trips.legacyData": {type: Object, optional: true},
  // "trips.legacyData.purchases": Number,
  "trips.legacyData.confirmedTrips": Number,
  "trips.legacyData.refusedTrips": Number,

  // computed properties for fast case and diacritics insensitive search
  search: Object,
  "search.firstname": {type: String, optional: true},
  "search.lastname": {type: String, optional: true},
  "search.email": {type: String, optional: true},
});

MembersCollection.attachSchema(MembersCollection.schema);