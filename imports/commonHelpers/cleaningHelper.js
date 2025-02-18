import { getMembershipLimitForYear } from "./membershipHelper";

function xMonthsAgo(x) {
  const xMonthsAgo = new Date();
  xMonthsAgo.setMonth(xMonthsAgo.getMonth() - x); // handles year switch if necessary

  return xMonthsAgo;
}

export function getCleaningRunLimitDate() {
  return xMonthsAgo(1);
}

export function getHelloAssoCleanDate() {
  return xMonthsAgo(1);
}

export function getLastMembershipCampaignEndDate() {
  const now = new Date();
  const currentYear = now.getFullYear();
  // const thisYearLimit = getMembershipLimitForYear(currentYear);
  // const referenceYear = now.getTime() > thisYearLimit
  //   ? currentYear - 1
  //   : currentYear - 2;

  const referenceYear = currentYear - 1;

  return lastMembershipCampaignEndDate = new Date(getMembershipLimitForYear(referenceYear));
}