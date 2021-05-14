<template>
  <FullPageLayout
    ref="layout"
    :title="title"
    backLabel="retour à la liste des sorties"
    backTarget="/trips"
    :hasUnsavedChanges="hasUnsavedChanges"
    :loading="!$subReady.trips || !$subReady.parameters"
  >
    <template v-slot:header-right>
      <DeleteButton
        v-if="!newTrip"
        entityLabel="cette sortie"
        :onDelete="deleteTrip"
      />
    </template>

    <template v-if="trip && parameters">
      <v-form @submit.prevent="handleSubmit">
        <v-row>
          <v-col>
            <DateInput 
              label="Date"
              :date.sync="trip.date"
              :allowFuturDates="true"
              />
          </v-col>

          <v-col>
            <v-select
              label="Capitaine"
              v-model="trip.captain" 
              :items="parameters.trip.captain"
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
              :items="parameters.trip.type"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Port"
              v-model="trip.port" 
              :items="parameters.trip.port"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Loueur"
              v-model="trip.renter" 
              :items="parameters.trip.renter"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <template v-if="refusedApplicants && refusedApplicants.length > 0">
          <h3>Candidats refusés</h3>
            <v-chip class="mr-2 mb-2" v-for="c in refusedApplicants" :key="c._id">
              {{ c.memberName }}
            </v-chip>
        </template>

        <h3>Équipage</h3>
        <v-row>
          <v-col :cols="newTrip ? 4 : 12">
            <v-simple-table 
              v-if="crew && crew.length > 0"
              class="elevation-3 mb-5"
            >
              <thead>
                <tr>
                  <th class="text-left" :style="{ width: '25%' }">Nom</th>
                  <th class="text-left" :style="{ width: '15%' }">Rôle</th>

                  <template v-if="!newTrip">
                    <th class="text-left" :style="{ width: '10%' }">Présent</th>
                    <th class="text-left" :style="{ width: '10%' }">Créditer la sortie</th>
                    <th class="text-left">Commentaire</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="applicant in crew"
                  :key="applicant.memberId"
                >
                  <td>{{ applicant.memberName }}</td>
                  <td>{{ applicant.assignedRole }}</td>
                  
                  <template v-if="!newTrip">
                    <td>
                      <v-switch v-model="applicant.onboard" inset />
                    </td>
                    <td>
                      <v-switch v-model="applicant.credited" inset />
                    </td>
                    <td>
                      <v-text-field
                        v-model="applicant.comment"
                        solo
                        flat
                        dense
                        outlined
                        hide-details="auto"
                      />
                    </td>
                  </template>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          elevation="5"
          class="mb-5"
          rounded
          @click="editCrew = true"
        >
          modifier l'équipage
          <v-icon right>mdi-pencil</v-icon>
        </v-btn>

        <v-dialog
          v-model="editCrew"
          persistent
          max-width="1000"
          min-height="600"
        >
            <CrewEditor 
              :applicants.sync="trip.applicants"
              :parameters="parameters"
              @close="editCrew = false"
            />
        </v-dialog>

        <template v-if="!newTrip">
          <h3>Après la sortie</h3>
          <v-row>
            <v-col :cols="4">
              <v-text-field
                label="Frais d'essence"
                suffix="€"
                v-model="trip.fee"
                type="number"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          
          <v-row>
            <v-col>
              <v-textarea
                label="Commentaires sur la sortie et observations réalisées"
                v-model="trip.comment" 
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </template>

        
        <div class="d-flex justify-end mt-4">
          <v-btn
            type="submit"
            color="primary"
            elevation="7"
            :loading="saving"
            :disabled="saving || !canSave"
            rounded
            large
          >
            {{ !!newTrip ? 'créer la sortie' : 'enregistrer les modifications' }}
          </v-btn>
        </div>
      </v-form>

    </template>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import DateInput from './DateInput.vue';
import CrewEditor from './CrewEditor.vue';
import DeleteButton from './DeleteButton.vue';
import { Meteor } from 'meteor/meteor';
import { TripsCollection } from "../../db/TripsCollection";
import { ParametersCollection } from "../../db/ParametersCollection";
import { formatDate } from '../helpers/dateHelper';
import { getAllProperties, getDelta } from '../helpers/objectHelper';

export default {
  components: {
    FullPageLayout,
    DateInput,
    CrewEditor,
    DeleteButton
  },
  props: {
    id: String
  },
  data: () => ({
    newTrip: undefined,
    saving: false,
    initialValues: undefined,
    editCrew: false,
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
    refusedApplicants() {
      return this.trip?.applicants?.filter(a => !a.assignedRole);
    },
    modifiedProperties() {
      if (!this.trip || !this.initialValues)
        return [];

      let newValues = getAllProperties(this.trip);

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
    handleSubmit(event) {
      // Set crew as onboard by default
      if (this.newTrip && this.crew) {
        this.crew.forEach(c => {
          c.onboard = true;
          c.credited = true;
        })
      }

      let changes = this.modifiedProperties; // compute it only once
      if (changes.length === 0) 
        return;

      this.saving = true;

      const callback = (error, result) => {
        this.$refs.layout.onSaveEnd(error, !!this.newTrip);
        setTimeout(() => this.saving = false, 500); // extra delay
        
        if (!error) {          
          this.initialValues = getAllProperties(this.trip);
        }
      };

      if (this.newTrip)
        Meteor.call('trips.create', changes, callback);
      else
        Meteor.call('trips.update', this.trip._id, changes, callback);
    },
    deleteTrip() {
      Meteor.call('trips.delete', this.trip._id, (error, resul) => {
        this.$refs.layout.onSaveEnd(error, true);
      });
    }
  },
  meteor: {
    $subscribe: {
      'trips': [],
      'parameters': []
    },
    parameters() {
      return ParametersCollection.findOne({});
    },
    trip() {
      if (!this.id)
        return undefined;

      if (this.id === 'new') {
        if (!this.newTrip) {
          this.newTrip = { 
            date: new Date(),
            applicants: []
          };

          this.initialValues = [];
        }

        return this.newTrip;
      }
      else {
        foundTrip = TripsCollection.findOne(this.id);

        if (foundTrip && !this.initialValues) {
          this.initialValues = getAllProperties(foundTrip);
        }

        return foundTrip;
      }
    }
  }
}
</script>