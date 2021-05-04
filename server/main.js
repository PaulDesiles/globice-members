import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { MembersCollection } from '/imports/db/MembersCollection';
import '/imports/api/membersPublications';
import '/imports/api/membersMethods';
import { TripsCollection } from '/imports/db/TripsCollection';
import '/imports/api/tripsPublications';
import '/imports/api/tripsMethods';

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
    TripsCollection.insert({ date: new Date(), captain: 'Paul', type: 'Test'});
    TripsCollection.insert({ date: new Date(), captain: 'Pierre', type: 'Test'});
    TripsCollection.insert({ date: new Date(), captain: 'Michel', type: 'Test'});
  }
});