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

import { addSearchValues } from './membersSeed.js';
import { seedAccounts } from './accountsSeed.js';

import { setApiListeners } from '/imports/api/helloAsso';
import { HelloAssoCollection } from '../imports/db/HelloAssoCollection.js';
import * as Sentry from "@sentry/node";

import { CleaningRunsCollection } from '../imports/db/CleaningRunsCollection.js';
import '/imports/api/cleaningRunMethods';

import { getLastMembershipCampaignEndDate } from "../imports/commonHelpers/cleaningHelper";

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

  // if (false) {
  //   MembersCollection.remove({});
  //   var memberSeed = getMemberSeed();
  //   membersSeed.forEach(m => MembersCollection.insert(m));
  // }

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
