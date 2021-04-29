import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { MembersCollection } from '/imports/db/MembersCollection';
import '/imports/api/membersPublications';
import stubData from './stubData.json';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  if (MembersCollection.find().count() === 1) {
    MembersCollection.remove({});
    stubData.members.forEach(m => MembersCollection.insert(m));
  }
});