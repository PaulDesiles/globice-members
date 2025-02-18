import { CleaningRunsCollection } from '../db/CleaningRunsCollection';
import { 
  ensureIsAdmin,
} from './commonMethods';
import { logMessage } from '../commonHelpers/logHelper';
import {
  getCleaningRunLimitDate,
  getHelloAssoCleanDate,
  getLastMembershipCampaignEndDate
} from '../commonHelpers/cleaningHelper';

Meteor.methods({
  'cleaning.clean'() {
    ensureIsAdmin(this.userId);

    const mostRecentRun = CleaningRunsCollection.findOne({}, { sort: { date: -1 }});
    const date = getCleaningRunLimitDate();

    if (mostRecentRun == null || mostRecentRun.date.getTime() < date) {
      logMessage('clean old data');
      
      const oneMonthAgo = getHelloAssoCleanDate();
      Meteor.call('helloasso.cleanup', oneMonthAgo);
      Meteor.call('parsedhelloasso.cleanup', oneMonthAgo);
  
      const lastMembershipCampaignEndDate = getLastMembershipCampaignEndDate();
      Meteor.call('members.oldMembership.cleanup', lastMembershipCampaignEndDate);
      Meteor.call('trips.cleanApplicants', lastMembershipCampaignEndDate);
  
      CleaningRunsCollection.insert({ date: new Date() });
    }
  }
});
