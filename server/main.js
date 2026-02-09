import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import fs from 'fs';

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

import { addSearchValues, getMemberSeed, linkOldTripsToRecreatedMembers, 
  nameComparer, getInitCounts, addTripBooksToMatchingMembers,
  addOldTripBooks, getOldTripsBooks,
  getForgottenTripBooks
} from './membersSeed.js';
import { seedAccounts } from './accountsSeed.js';

import { setApiListeners } from '/imports/api/helloAsso';
import { HelloAssoCollection } from '../imports/db/HelloAssoCollection.js';
import * as Sentry from "@sentry/node";

import { CleaningRunsCollection } from '../imports/db/CleaningRunsCollection.js';
import '/imports/api/cleaningRunMethods';

import { getLastMembershipCampaignEndDate } from "../imports/commonHelpers/cleaningHelper";
import { get2025TripsLeft } from "../imports/ui/helpers/memberHelper.js";

Meteor.startup(() => {
  setApiListeners();
  
  // -- Log reporting
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }

  // --- Helpers for seeding from a local instance ---
  seedAccounts();

  if (!ParametersCollection.findOne({})) {
    initParametersCollection();
  }

  // var members = MembersCollection.find({ 'abilities.nemmo': 'Apprenti' })
  // .fetch();

  // console.log(members.length);

  // members.forEach(m => MembersCollection.update(
  //   m._id,
  //   { $set: { 'abilities.nemmo': '_' } }
  // ));

  // HelloAssoCollection.remove({});
  // const lines = fs.readFileSync('D:\\Docs_Globice\\helloAssoTestData.json', 'utf8').split('\n');
  
  // lines.forEach((line, index) => {
  //     console.log(`${index + 1} / ${lines.length}`);
  //     line = line.trim();
  //     if (line) {
  //       var obj = JSON.parse(line);
  //       if (obj) {
  //         HelloAssoCollection.insert(
  //           obj,
  //           { bypassCollection2: true }
  //         );
  //       }
  //     }
  //   });
  

  // if (!PublicParametersCollection.findOne({})) {
  //   PublicParametersCollection.insert({
  //     showDemoCredentials: 1
  //   });
  // }

  if (0) {
    // MembersCollection.remove({});
    var membersSeed = getMemberSeed();
    // console.log(membersSeed);
    membersSeed.forEach(m => MembersCollection.insert(m));
  }

  if (0) {
    linkOldTripsToRecreatedMembers();
  }

  // set initial trip counts
  if (0) {
    const members = MembersCollection.find({})
      .fetch();
    
    const counts = getInitCounts();

    addTripBooksToMatchingMembers(members, counts);
  }

  // add old trip books
  if (0) {
    const members = MembersCollection.find({})
      .fetch();
    
    const counts = getOldTripsBooks();

    addOldTripBooks(members, counts);
  }

// tripbooks bought in 24 disappeared if membership renewed in 25
  if (0) {
    //getForgottenTripBooks();
  }

  if (1) {
    console.log('--- check 2025 negative trip counts members using same email');
    MembersCollection.find({})
      .fetch()
      .forEach(member => {
        let solde = get2025TripsLeft(member._id, member.trips.purchases, member.trips.confirmedTrips);
        
        if (solde < 0) {
          console.log(`${member._id} _ ${member.infos.firstname} ${member.infos.lastname}  ${member.infos.email} _ ${solde}` );
        }
      });
  }
  
  if (1) {
    console.log('--- finding members using same email');

    let membersByEmail = new Map();
    MembersCollection.find({})
      .fetch()
      .forEach(member => {
        membersByEmail.set(member.infos.email, 
          [
          ...membersByEmail.get(member.infos.email) ?? [],
          `${member._id} _ ${member.infos.firstname} ${member.infos.lastname}`
        ]);
      });

      membersByEmail.forEach(element => {
        if (element.length > 1) {
          console.log(element);
        }
      });
  }

  if (1) {
    console.log('--- finding members with duplicate memberships or tripbooks');

    MembersCollection.find({})
      .fetch()
      .forEach(member => {
        let memberships = new Map();

        [member.membership.date, ...member.membership.previousMemberships]
          .forEach(x => {
            
            memberships.set(x.getFullYear(), 
              [
              ...memberships.get(x.getFullYear()) ?? [],
              `${member._id} _ ${member.infos.firstname} ${member.infos.lastname} _ membership ${x.toLocaleDateString()}`
            ]);
          });

          memberships.forEach(element => {
            if (element.length > 1) {
              console.log(element);
            }
          });
          
        let tripbooks = new Map();

        member.trips.purchases
          .forEach(x => {
            
            tripbooks.set(x.date.toLocaleDateString(), 
              [
              ...tripbooks.get(x.date.toLocaleDateString()) ?? [],
              `${member._id} _ ${member.infos.firstname} ${member.infos.lastname} _ tripbook ${x.size} - ${x.date.toLocaleDateString()}`
            ]);
          });

          tripbooks.forEach(element => {
            if (element.length > 1) {
              console.log(element);
            }
          });
      });
  }
  // --- Ajout des infos de search à tous les membres
  // addSearchValues();

  Sentry.captureMessage("meteor startup init ended");
});

// log all non-catched errors
const originalMeteorDebug = Meteor._debug;
Meteor._debug = (message, stack) => {
  const error = new Error(message);
  error.stack = stack;
  Sentry.captureException(error);
  return originalMeteorDebug.bind(this).call(message, stack);
};
