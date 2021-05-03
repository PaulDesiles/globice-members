import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { MembersCollection } from '/imports/db/MembersCollection';
import '/imports/api/membersPublications';
import '/imports/api/membersMethods';

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
});