<template>
  <FullPageLayout 
    title="Sorties"
    backLabel="retour à l'accueil"
    backTarget="/">
    <template v-slot:header-right>
      <v-btn
        color="primary"
        elevation="5"
        rounded
        @click="createTrip"
      >
        <v-icon left>mdi-calendar</v-icon>
          créer une sortie
      </v-btn>
    </template>
    <template v-slot:top-right>
      <ExpandingButton
          icon="mdi-download"
          label="Télécharger les données" 
          :onClick="download"
        />
    </template>
    <v-row>
      <v-layout child-flex>
        <v-data-table
          :headers="headers"
          :items="trips"
          :disablePagination="true"
          :hide-default-footer="true"
          :must-sort="true"
          :options="{ sortBy: ['date'], sortDesc: [true] }"
          :item-class="i => 'memberRow'"
          :loading="!$subReady.trips"
          loading-text="chargement..."
          no-data-text="aucune sortie trouvée"
          @click:row="itemClick"
          class="elevation-3"
        >
          <template v-slot:[`item.date`]="{item}">
              <span>{{ formatDate(item.date) }}</span>
          </template>
          <template v-slot:[`item.state`]="{item}">
              <span>{{ getTripState(item) }}</span>
          </template>
        </v-data-table>
      </v-layout>
    </v-row>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from '../../components/FullPageLayout.vue';
import ExpandingButton from '../../components/ExpandingButton.vue';
import { Meteor } from 'meteor/meteor';
import { TripsCollection } from "../../../db/TripsCollection";
import { sortDates, formatDate } from '../../helpers/dateHelper';
import { exportTrips } from '../../helpers/exportHelper';

export default {
  components: {
    FullPageLayout,
    ExpandingButton
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Date', value: 'date', sort: sortDates },
        { text: 'Capitaine', value: 'captain' },
        { text: 'Port', value: 'port' },
        { text: 'Type', value: 'type' },
        { text: 'Loueur', value: 'renter' },
        { text: 'Etat', value: 'state'}
      ]
    };
  },
  methods: {
    formatDate,
    itemClick(item) {
      this.$router.push({ path: `/trip/${item._id}` });
    },
    createTrip() {
      this.$router.push({ path: `/trip/new` });
    },
    getTripState(trip) {
      if (trip && trip.fee != undefined && trip.observations)
        return 'terminée';

      return 'en cours';
    },
    download() {
      if (this.trips) {
        exportTrips(this.trips);
      }
    },
  },
  meteor: {
    $subscribe: {
      'trips': []
    },
    trips() {
      return TripsCollection.find({ }).fetch();
    }
  }
};
</script>
