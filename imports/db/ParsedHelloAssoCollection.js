import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { memberBase } from './MembersCollection';

export const ParsedHelloAssoCollection = new Mongo.Collection('parsedhelloasso');


const MemberData = new SimpleSchema(memberBase);

ParsedHelloAssoCollection.schema = new SimpleSchema({
  _id: String,
  sourceData: Object,
  resolved: Boolean,

  parsedData: { type: Object, optional: true },
  'parsedData.memberInfos': { type: Object, optional: true },
  'parsedData.memberInfos.firstName': String,
  'parsedData.memberInfos.lastName': String,
  'parsedData.renewMembership': Boolean,
  'parsedData.tripBooks': Number,
  'parsedData.memberData': { type: MemberData, optional: true },
  
});

ParsedHelloAssoCollection.attachSchema(ParsedHelloAssoCollection.schema);
