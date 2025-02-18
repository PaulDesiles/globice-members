export function getMembershipLimitForYear(year) {
  return Date.UTC(year, 4, 31, 0, 0, 0);
}