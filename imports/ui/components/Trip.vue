<template>
  <FullPageLayout
    ref="layout"
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

        <h3>Équipage</h3>
        <ul v-if="crew">
          <li v-for="c in crew" :key="c._id">
            {{ c.memberName }} - {{ c.assignedRole }}
          </li>
        </ul>
        <p v-else><i>Aucun membre d'équipage enregistré</i></p>

        <v-btn
          color="primary"
          elevation="5"
          rounded
          @click="editCrew = true"
        >
          modifier l'équipage
        </v-btn>

        <v-row>
          <v-col>
            <v-btn
              type="submit"
              color="primary"
              elevation="5"
              :loading="saving"
              :disabled="saving || !canSave"
              rounded
            >
              {{ !!newTrip ? 'créer la sortie' : 'enregister les modifications' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-dialog
        v-model="editCrew"
        persistent
        max-width="900"
        min-height="600"
      >
        <CrewEditor 
          :applicants.sync="trip.applicants"
          @close="editCrew = false"
        />
      </v-dialog>
    </template>

  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import DateInput from './DateInput.vue';
import CrewEditor from './CrewEditor.vue';
import { Meteor } from 'meteor/meteor';
import { TripsCollection } from "../../db/TripsCollection";
import { formatDate } from '../helpers/dateHelper';
import { getDelta } from '../helpers/objectHelper';

export default {
  components: {
    FullPageLayout,
    DateInput,
    CrewEditor
  },
  props: {
    id: String
  },
  data: () => ({
    newTrip: undefined,
    saving: false,
    initialValues: undefined,
    editCrew: false,
    choices: {
      captain: [ 'John', 'James'],
      type: [ 'Declic', 'Long Bec'],
      port: [ 'St Denis', 'St Gilles', 'St Pierre', 'Ste Rose'],
      renter: [ 'Batoloc', 'loc'],
    }
  }),
  computed: {
    title() {
      if (this.newTrip)
        return 'Nouvelle Sortie';
      else if (this.trip?.date)
        return `Sortie du ${formatDate(this.trip.date)}`;

      return 'Sortie';
    },
    crew() {
      return this.trip?.applicants?.filter(a => a.assignedRole);
    },
    modifiedProperties() {
      if (!this.trip || !this.initialValues)
        return [];

      let newValues = this.getAllProperties(this.trip);

      return getDelta(newValues, this.initialValues)
        .map(k => ({key: k, value: newValues[k]}));
    },
    hasUnsavedChanges() {
      return this.modifiedProperties.length > 0;
    },
    canSave() {
      return this.hasUnsavedChanges &&
        !!this.trip.date &&
        !!this.trip.captain &&
        !!this.trip.type &&
        !!this.trip.port &&
        !!this.trip.renter &&
        this.crew?.length > 0;
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

      const callback = (error, result) => {
        this.$refs.layout.onSaveEnd(error);
        setTimeout(() => this.saving = false, 500); // extra delay
        
        if (!error)
          this.initialValues = this.getAllProperties(foundTrip);
      };

      if (!!this.newTrip)
        Meteor.call('trips.create', changes, callback);
      else
        Meteor.call('trips.update', this.trip._id, changes, callback);
    }
  },
  meteor: {
    $subscribe: {
      'trips': []
    },
    trip() {
      if (!this.id)
        return undefined;

      let foundTrip;

      if (this.id === 'new') {
        if (!this.newTrip) {
          this.newTrip = { 
            date: new Date(),
            applicants: []
          };
        }

        foundTrip = this.newTrip;
      }
      else {
        foundTrip = TripsCollection.findOne(this.id);
      }

      // initialValues will allow to detect form modifications
      if (foundTrip && !this.initialValues) {
        this.initialValues = this.getAllProperties(foundTrip);
      }

      return foundTrip;
    }
  }
}
</script>