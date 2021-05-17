<template>
  <div>
    <p class="mb-0">
      <span class="text--secondary">Au cours des 2 derniers mois : </span>
      {{ getXMonthsLabel(2) }}
    </p>
    <p>
      <span class="text--secondary">Au cours de l'année : </span>
      {{ getXMonthsLabel(12) }}
    </p>

    <v-simple-table 
      v-if="trips && trips.length > 0"
      class="elevation-3 mb-5"
    >
      <thead>
        <tr>
          <th class="text-left" :style="{ width: '20%' }">Date</th>
          <th class="text-left" :style="{ width: '20%' }">Port</th>
          <th class="text-left">{{ showComments ? 'Commentaire sur le bénévole' : '' }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="trip in trips"
          :key="trip.id"
        >
          <td>{{ formatDate(trip.date) }}</td>
          <td>{{ trip.port }}</td>
          <td v-if="showComments">
            {{ getComment(trip) }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import { formatDate } from '../../helpers/dateHelper';
import { getLastXMonthsCount } from '../../helpers/tripsHelper';

export default {
  props: {
    trips: Array,
    memberId: String,
    showComments: Boolean,
    adjectiveSingular: String
  },
  methods: {
    formatDate,
    getComment(trip) {
      return trip.applicants
        .filter(a => a.memberId === this.memberId)
        [0]
        ?.comment;
    },
    getXMonthsLabel(x) {
      const count = getLastXMonthsCount(this.trips, x);
      const suffix = (count > 1 ? 's' : '');
      return `${count} sortie${suffix} ${this.adjectiveSingular}${suffix}`;
    },
  }
}
</script>