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
    <span>adhésion à jour</span>
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
      return getTripsLeft(this.member);
    },
    isMembershipUpToDate() {
      return isMembershipUpToDate(this.member);
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