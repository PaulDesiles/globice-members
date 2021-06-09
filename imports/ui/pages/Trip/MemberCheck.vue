<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <span
        v-bind="attrs"
        v-on="on"
      >
        {{ isValid ? 'oui' : 'non' }}
      </span>
    </template>
    <span>{{ tripsLeft }} {{ tripsLabel }} sur le carnet</span>
    <br />
    <span v-if="isMembershipUpToDate">adhésion à jour</span>
    <span v-else>adhésion non renouvellée</span>
  </v-tooltip>
</template>

<script>
import { formatDate } from '../../helpers/dateHelper';
import { isMembershipUpToDate, getTripsLeft } from '../../helpers/memberHelper';

export default {
  props: {
    member: Object,
  },
  computed: {
    tripsLeft() {
      return getTripsLeft(
        this.member._id,
        this.member.trips.purchases,
        this.member.trips.confirmedTrips
      );
    },
    isMembershipUpToDate() {
      return isMembershipUpToDate(this.member.membership.date);
    },
    tripsLabel() {
      return this.tripsLeft > 1 ? 'sorties restantes' : 'sortie restante';
    },
    membershipLabel() {
      return this.isMembershipUpToDate ? 'adhésion à jour' : `dernière adhésion le ${formatDate(this.member.membership.date)}`
    },
    isValid() {
      return this.isMembershipUpToDate && this.tripsLeft > 0;
    }
  }
}
</script>