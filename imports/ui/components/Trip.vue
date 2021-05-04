<template>
  <FullPageLayout
    :title="title"
    backLabel="retour à la liste des sorties"
    backTarget="/trips"
    :hasUnsavedChanges="hasUnsavedChanges"
    :loading="!$subReady.trips"
  >
    <template v-if="trip">
      <v-form @submit.prevent="handleSubmit">
        <v-row>
          <v-col>
            <DateInput 
              label="Date"
              :date="trip.date"
              :setDate="d => trip.date = d"
              :allowFuturDates="true"
              />
          </v-col>

          <v-col>
            <v-select
              label="Capitaine"
              v-model="trip.captain" 
              :items="choices.captain"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select
              label="Type"
              v-model="trip.type" 
              :items="choices.type"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Port"
              v-model="trip.port" 
              :items="choices.port"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Loueur"
              v-model="trip.renter" 
              :items="choices.renter"
              outlined
              hide-details="auto"
            />
          </v-col>        
        </v-row>

      </v-form>
    </template>

  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import { Meteor } from 'meteor/meteor';
import { TripsCollection } from "../../db/TripsCollection";
import DateInput from './DateInput.vue';
import { formatDate } from '../helpers/dateHelper';

export default {
  components: {
    FullPageLayout,
    DateInput
  },
  props: {
    id: String
  },
  data: () => ({
    newTrip: undefined,
    isNew: false,
    saving: false,
    initialValues: undefined,
    showDialog: false,
    choices: {
      captain: [ 'John', 'James'],
      type: [ 'Declic', 'Long Bec'],
      port: [ 'St Denis', 'St Gilles', 'St Pierre', 'Ste Rose'],
      renter: [ 'Batoloc', 'loc'],
    }
  }),
  computed: {
    title() {
      let title = "Sortie";
      if (this.trip?.date)
        title += ` du ${formatDate(this.trip.date)}`;

      return title;
    },
    modifiedProperties() {
      if (!this.trip || !this.initialValues)
        return [];

      let newValues = this.getAllProperties(this.trip);

      return Object.keys(newValues).filter(k => {
        let newValue = newValues[k];
        let oldValue = this.initialValues[k]

        if (newValue && oldValue && typeof newValue.getTime === 'function') // Date comparison
          return newValue.getTime() !== oldValue.getTime();
        
        return newValue !== oldValue; // Standard types comparison
      })
      .map(k => ({key: k, value: newValues[k]}));
    },
    hasUnsavedChanges() {
      return this.modifiedProperties.length > 0;
    }
  },
  methods: {
    getAllProperties(m) {
        let properties = {};
        Object.keys(m).forEach(key => properties[key] = m[key]);
        return properties;
    },
    handleSubmit(event) {
      let changes = this.modifiedProperties;
      if (changes.length === 0) 
        return;

      this.saving = true;
      Meteor.call('trips.updateProperties', 
        this.trip._id, 
        changes,
        (error, result) => {
          this.$refs.layout.onSaveEnd(error);
          setTimeout(() => this.saving = false, 500); // extra delay
        }
      );
    }
  },
  meteor: {
    $subscribe: {
      'trips': []
    },
    trip() {
      if (!this.id)
        return undefined;

      if (this.id === 'new') {
        if (!this.newTrip) {
          this.isNew = true;
          this.newTrip = { 
            date: new Date()
          };
        }

        return this.newTrip;
      }

      let foundTrip = TripsCollection.findOne(this.id);

      // initialValues will allow to detect form modifications
      if (foundTrip && !this.initialValues) {
        this.initialValues = this.getAllProperties(foundTrip);
      }

      return foundTrip;
    }
  }
}
</script>