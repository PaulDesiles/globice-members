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
  },
  computed: {
    monthsCount() {
      return getLastXMonthsCount(this.trips, this.months);
    },
    yearCount() {
      return getLastXMonthsCount(this.trips, 12);
    }
  }
}
</script>