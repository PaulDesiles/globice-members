<template>
  <FullPageLayout 
    title="Sorties"
    backLabel="retour à l'accueil"
    backTarget="/">

    <v-row>
      <v-col>
        <v-btn
          color="primary"
          elevation="5"
          rounded
          @click="createTrip"
        >
          créer une sortie
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-layout child-flex>
        <v-data-table
          :headers="headers"
          :items="trips"
          :disablePagination="true"
          :hide-default-footer="true"
          :must-sort="true"
          :options="{ sortBy: ['date'] }"
          :item-class="i => 'memberRow'"
          :loading="!$subReady.trips"
          loading-text="chargement..."
          @click:row="itemClick"
          class="elevation-3"
        >
          <template v-slot:[`item.date`]="{item}">
              <span>{{ formatDate(item.date) }}</span>
          </template>
        </v-data-table>
      </v-layout>
    </v-row>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import { Meteor } from 'meteor/meteor';
import { TripsCollection } from "../../db/TripsCollection";
import { sortDates, formatDate } from '../helpers/dateHelper';

export default {
  components: {
    FullPageLayout
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
        { text: 'Etat', value: 'state' }
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
    }
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