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
import { HelloAssoCollection } from '../imports/db/HelloAssoCollection.js';

// import membersSeed from './membersSeed.js';
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
  //   membersSeed.forEach(m => MembersCollection.insert(m));
  // }

});