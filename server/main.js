import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { MembersCollection } from '/imports/db/MembersCollection';
import '/imports/api/membersPublications';
import '/imports/api/membersMethods';
import { TripsCollection } from '/imports/db/TripsCollection';
import '/imports/api/tripsPublications';
import '/imports/api/tripsMethods';
import { ParametersCollection } from '../imports/db/ParametersCollection.js';
import '/imports/api/parametersPublications';
import '/imports/api/parametersMethods';

import membersSeed from './membersSeed.js';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  if (false) {
    MembersCollection.remove({});
    membersSeed.forEach(m => MembersCollection.insert(m));
  }

  if (false) {
    TripsCollection.remove({});
  }

  var params = ParametersCollection.findOne({});
  if (!params) {
    
    const labelAsValue = (x) => ({
      text: x,
      value: x
    });

    ParametersCollection.insert({
      trip: {
        captain: [ 'John', 'James'].map(labelAsValue),
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
});