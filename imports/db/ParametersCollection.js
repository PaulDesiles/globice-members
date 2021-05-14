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
  'trip.captain': [choiceSchema],
  'trip.type': [choiceSchema],
  'trip.port': [choiceSchema],
  'trip.renter': [choiceSchema],
  'trip.roles': [choiceSchema],

  member: Object,
  'member.boatLicense': [choiceSchema],
  'member.captain': [choiceSchema],
  'member.diving': [choiceSchema],
  'member.photo': [choiceSchema],
  'member.newMember': [choiceSchema],
  'member.bookSizeChoices': [choiceSchema],

  newMemberForm: Object, // HelloAsso form question labels to link the answers back to member fields
  'newMemberForm.birthdate': String,
  'newMemberForm.email': String,
  'newMemberForm.phone': String,
  'newMemberForm.address': String,
  'newMemberForm.postCode': String,
  'newMemberForm.city': String,
  'newMemberForm.boatLicense': String,
  'newMemberForm.captain': String,
  'newMemberForm.diving': String,
  'newMemberForm.photo': String,
  'newMemberForm.isNewMember': String,
});

ParametersCollection.attachSchema(ParametersCollection.schema);

export function getParameters() {
  return ParametersCollection.findOne({});
};

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
    newMemberForm: {
      birthdate: 'Date de naissance',
      email: 'Email',
      phone: 'Numéro de téléphone',
      address: 'Adresse',
      postCode: 'Code Postal',
      city: 'Ville',
      boatLicense: 'Disposez-vous du permis bateau ?',
      captain: 'Souhaiteriez-vous éventuellement être capitaine (permis bateau et expérience exigée) ?',
      diving: 'Quel est votre niveau de plongée ?',
      photo: 'Quelle est votre compétence en photographie ?',
      isNewMember: 'Cette adhésion est-elle :',
    }
  });
}