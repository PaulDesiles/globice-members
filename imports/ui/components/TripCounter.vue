<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <span
        v-bind="attrs"
        v-on="on"
      >
        {{ monthsCount }}
      </span>
    </template>
    <span>{{ monthsCount }} sur {{ months }} mois, {{ yearCount }} sur l'année</span>
  </v-tooltip>
</template>

<script>
import { getLastXMonthsCount } from '../helpers/tripsHelper';

export default {
  props: {
    trips: Array,
    months: { type: Number, default: 2 },
    isConfirmedList: Boolean,
    currentTripId: String,
    memberId: String
  },
  computed: {
    allTripsButCurrent() {
      return this.trips.filter(t => t.id !== this.currentTripId);
    },
    monthsCount() {
      return getLastXMonthsCount(this.allTripsButCurrent, this.months, this.isConfirmedList && this.memberId);
    },
    yearCount() {
      return getLastXMonthsCount(this.allTripsButCurrent, 12, this.isConfirmedList && this.memberId);
    }
  }
}
</script>