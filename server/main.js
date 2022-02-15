import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { MembersCollection } from '/imports/db/MembersCollection';
import '/imports/api/membersPublications';
import '/imports/api/membersMethods';
import { TripsCollection } from '/imports/db/TripsCollection';
import '/imports/api/tripsPublications';
import '/imports/api/tripsMethods';
import { ParametersCollection, initParametersCollection } from '../imports/db/ParametersCollection.js';
import '/imports/api/parametersPublications';
import '/imports/api/parametersMethods';
import { PublicParametersCollection } from '../imports/db/PublicParametersCollection.js';
import '/imports/api/publicParametersPublications';
import { ParsedHelloAssoCollection } from '../imports/db/ParsedHelloAssoCollection.js';
import '/imports/api/parsedHelloAssoPublications';
import '/imports/api/parsedHelloAssoMethods';
import '/imports/api/rolesAssignmentsPublications';

import { addSearchValues } from './membersSeed.js';
import { seedAccounts } from './accountsSeed.js';

import { setApiListeners } from '/imports/api/helloAsso';

Meteor.startup(() => {
  setApiListeners();

  // --- Helpers for seeding from a local instance ---

  seedAccounts();

  if (!ParametersCollection.findOne({})) {
    initParametersCollection();
  }

  // if (!PublicParametersCollection.findOne({})) {
  //   PublicParametersCollection.insert({
  //     showDemoCredentials: 1
  //   });
  // }

  // if (false) {
  //   MembersCollection.remove({});
  //   var memberSeed = getMemberSeed();
  //   membersSeed.forEach(m => MembersCollection.insert(m));
  // }

  // --- Ajout des infos de search à tous les membres
  // addSearchValues();

});