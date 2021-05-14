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

// import membersSeed from './membersSeed.js';

import { setApiListeners } from '/imports/api/helloAsso';

Meteor.startup(() => {
  setApiListeners();
  
  // --- Helpers for seeding from a local instance ---

  // if (!Accounts.findUserByUsername('user')) {
  //   Accounts.createUser({
  //     username: process.env.DEFAULT_USER,
  //     password: process.env.DEFAULT_USER_PASSWORD,
  //   });
  // }

  ParametersCollection.remove({});
  initParametersCollection();

  // if (!ParametersCollection.findOne({})) {
  //   initParametersCollection();
  // }

  // if (true) {
  //   MembersCollection.remove({});
  //   membersSeed.forEach(m => MembersCollection.insert(m));
  // }

});