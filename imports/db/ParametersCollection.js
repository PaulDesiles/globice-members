import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ParametersCollection = new Mongo.Collection('parameters');

const choiceSchema = new SimpleSchema({
  text: String,
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

export function initParametersCollection() {    
  const labelAsValue = (x) => ({
    text: x,
    value: x
  });

  ParametersCollection.insert({
    trip: {
      captain: [ 'Alain', 'Bernard', 'Héloïse', 'Isabelle', 'Jean-Marc', 'Lilly', 'Patrick'].map(labelAsValue),
      type: [ 'Declic', 'Long Bec'].map(labelAsValue),
      port: [ 'St Denis', 'St Gilles', 'St Pierre', 'Ste Rose'].map(labelAsValue),
      renter: [ 'Batoloc', 'loc'].map(labelAsValue),
      roles: [
        { text:'aucun', value: null }, 
        labelAsValue('script'), 
        labelAsValue('observateur'), 
        labelAsValue('photographe') 
      ],
    },
    member: {
      boatLicense: [ "Non", "Côtier", "Hauturier" ].map(labelAsValue),
      captain: [ "Non", "Oui" ].map(labelAsValue),
      diving: [ "Aucun", ...[1,2,3,4,5].map(x => `Niveau ${x}`) ].map(labelAsValue),
      photo: [ "Amateur", "Amateur ++", "Professionnel" ].map(labelAsValue),
      newMember: [ "Non", "Oui" ].map(labelAsValue),
      bookSizeChoices: [
        { text:'5 sorties', value: 5 }, 
        { text:'10 sorties', value: 10 }, 
      ]
    },
  });
}