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
          <template v-if="isConfirmedList">
            <th class="text-left" :style="{ width: '10%' }">Présent</th>
            <th class="text-left" :style="{ width: '10%' }">Crédité</th>
            <th class="text-left">Commentaire sur le bénévole</th>
          </template>
          <th class="text-left" :style="{ width: '10%' }">Lien</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="trip in trips"
          :key="trip._id"
        >
          <td>{{ formatDate(trip.date) }}</td>
          <template v-if="trip.legacy">
            <td>inconnu</td>
            <template v-if="isConfirmedList">
              <td></td>
              <td></td>
              <td></td>
            </template>
            <td></td>
          </template>
          <template v-else>
            <td>{{ trip.port }}</td>
            <template v-if="isConfirmedList">
              <td>
                <v-checkbox :input-value="getApplicant(trip).onboard" value disabled />
              </td>
              <td>
                <v-checkbox :input-value="getApplicant(trip).credited" value disabled />
              </td>
              <td>{{ getApplicant(trip).comment }}</td>
            </template>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    icon
                    v-bind="attrs"
                    v-on="on"
                    :to="`/trip/${ trip._id }`"
                    target="_blank"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
                <span>ouvrir la fiche sortie</span>
              </v-tooltip>
            </td>
          </template>
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
    isConfirmedList: Boolean
  },
  methods: {
    formatDate,
    getApplicant(trip) {
      return trip.applicants
        ?.find(a => a.memberId === this.memberId)
        || {
          onboard: '',
          credited: '',
          comment: '',
        };
    },
    getXMonthsLabel(x) {
      const count = getLastXMonthsCount(
        this.trips, 
        x, 
        this.isConfirmedList && this.memberId
      );
      const suffix = (count > 1 ? 's' : '');
      const adjectiveSingular = this.isConfirmedList ? "effectuée" : "refusée";
      return `${count} sortie${suffix} ${adjectiveSingular}${suffix}`;
    },
  }
}
</script>