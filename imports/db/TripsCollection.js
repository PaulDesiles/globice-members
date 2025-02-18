import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const TripsCollection = new Mongo.Collection('trips');
export const maxApplicantNote = 5;

const applicantSchema = new SimpleSchema({
  memberId: { type: String, regEx: SimpleSchema.RegEx.Id },
  memberName: String,
  desiredRole: { type: String, optional: true },
  assignedRole: { type: String, optional: true },
  onboard: { type: Boolean, optional: true },
  credited: { type: Boolean, optional: true },
  comment: { type: String, optional: true },
  note: { type: Number, optional: true },
});

TripsCollection.schema = new SimpleSchema({
  _schemaVersion: { type: Number, defaultValue: 1.1 },
  _creationDate: Date,
  _modificationDate: {type: Date, optional: true},
  _anonymized:{ type: Boolean, optional: true },

  date: Date,
  captain: String,
  type: String,
  port: String,
  renter: String,
  applicants: [applicantSchema],
  fee: { type: Number, optional: true },
  observations: { type: String, optional: true },
  alerts: { type: String, optional: true },
});

TripsCollection.attachSchema(TripsCollection.schema);