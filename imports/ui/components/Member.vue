<template>
  <FullPageLayout 
    ref="layout"
    :title="title"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members"
    :hasUnsavedChanges="hasUnsavedChanges"
    :loading="!$subReady.members || !$subReady.parameters"
  >
    <template v-slot:header-right>
      <DeleteButton
        v-if="!newMember"
        entityLabel="ce bénévole"
        :onDelete="deleteMember"
      />
    </template>

    <template v-if="member && parameters">
      <v-form @submit.prevent="handleSubmit">
        <h3>Informations personnelles</h3>

        <v-row>
          <v-col>
            <v-text-field 
              label="Nom"
              v-model="member.infos.lastname" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <v-text-field 
              label="Prénom"
              v-model="member.infos.firstname" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <DateInput 
              label="Date de naisance"
              :date.sync="member.infos.birthdate"
              :startWithYear="true"
              />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="8">
            <v-text-field 
              label="Email"
              v-model="member.infos.email"
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col :cols="4">
            <v-text-field 
              label="Téléphone"
              v-model="member.infos.phone" 
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="6">
            <v-text-field 
              label="Adresse"
              v-model="member.infos.address" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col :cols="2">
            <v-text-field 
              label="Code postal"
              v-model="member.infos.postCode" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col :cols="4">
            <v-text-field 
              label="Ville"
              v-model="member.infos.city" 
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>


        <h3>Compétences</h3>
        <v-row>
          <v-col>
            <v-select
              label="Permis Bateau"
              v-model="member.abilities.boatLicense" 
              :items="parameters.member.boatLicense"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Capitaine"
              v-model="member.abilities.captain" 
              :items="parameters.member.captain"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Plongée"
              v-model="member.abilities.diving" 
              :items="parameters.member.diving"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Photographie"
              v-model="member.abilities.photo" 
              :items="parameters.member.photo"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea 
              label="Commentaire"
              v-model="member.abilities.comment"
              outlined
              hide-details="auto" 
            />
          </v-col>
        </v-row>

        <h3>Adhésion</h3>
        <v-row>
          <v-col :cols="3">
            <DateInput 
              label="Date d'adhésion"
              :date.sync="member.membership.date"
            />
          </v-col>

          <v-col :cols="3">
            <v-select
              label="Primo-adhésion"
              v-model="member.membership.isNewMember" 
              :items="parameters.member.newMember"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>


        <h3>Carnets de sorties</h3>
        <TripBooks 
          :purchases.sync="member.trips.purchases"
          :parameters="parameters"
        />
        
        <h3>Sorties effectuées</h3>
        <TripList
          :trips="confirmedTrips"
          :memberId="id"
          showComments
          adjectiveSingular="effectuée"
        />

        <h3>Sorties refusées</h3>
        <TripList
          :trips="refusedTrips"
          :memberId="id"
          adjectiveSingular="refusée"
        />

        <div class="d-flex justify-end">
          <v-btn
            type="submit"
            color="primary"
            elevation="7"
            :loading="saving"
            :disabled="saving || !canSave"
            rounded
            large
          >
            {{ !!newMember ? 'ajouter le bénévole' : 'enregistrer les modifications' }}
          </v-btn>
        </div>
      </v-form>
    </template>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import DateInput from './DateInput.vue';
import DeleteButton from './DeleteButton.vue';
import TripBooks from './TripBooks.vue';
import TripList from './TripList.vue';

import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";
import { TripsCollection } from "../../db/TripsCollection";
import { ParametersCollection } from "../../db/ParametersCollection";
import { getAllProperties, getDelta } from '../helpers/objectHelper';

export default {
  components: {
    FullPageLayout,
    DateInput,
    DeleteButton,
    TripBooks,
    TripList,
  },
  props: {
    id: String
  },
  data: () => ({
    newMember: undefined,
    saving: false,
    initialValues: undefined,
    linkedTrips: []
  }),
  computed: {
    title() {
      if (this.newMember)
        return "Nouveau bénévole";
      if (this.member?.infos)
        return `Bénévole : ${this.member.infos.firstname} ${this.member.infos.lastname}`;

      return "Bénévole";
    },
    modifiedProperties() {
      if (!this.member || !this.initialValues)
        return [];

      let newValues = this.getAllFilteredProperties(this.member);

      return getDelta(newValues, this.initialValues)
        .map(k => ({key: k, value: newValues[k]}));
    },
    hasUnsavedChanges() {
      return this.modifiedProperties.length > 0;
    },
    canSave() {
      return this.hasUnsavedChanges &&
        !!this.member.infos.firstname &&
        !!this.member.infos.lastname &&
        !!this.member.infos.email;
    }
  },
  methods: {
    getAllFilteredProperties(member) {
      return getAllProperties(
            member,
            true,
            ['trips.confirmedTrips', 'trips.refusedTrips']
          );
    },
    handleSubmit(event) {
      let changes = this.modifiedProperties; // compute it only once
      if (changes.length === 0) 
        return;

      this.saving = true;

      const callback = (error, result) => {
        this.$refs.layout.onSaveEnd(error, !!this.newMember);
        setTimeout(() => this.saving = false, 500); // extra delay
        
        if (!error) {          
          this.initialValues = this.getAllFilteredProperties(this.member);
        }
      };

      if (this.newMember)
        Meteor.call('members.create', this.member, callback);
      else
        Meteor.call('members.update', this.member._id, changes, callback);
    },
    deleteMember() {
      Meteor.call('members.delete', this.member._id, (error, resul) => {
        this.$refs.layout.onSaveEnd(error, true);
      });
    }
  },
  meteor: {
    $subscribe: {
      'members': [],
      'parameters': [],
      'trips':[]
    },
    parameters() {
      return ParametersCollection.findOne({});
    },
    member() {
      if (!this.id)
        return undefined;

      if (this.id === 'new') {
        if (!this.newMember) {
          this.newMember = {
            infos: {
              birthdate: new Date()
            },
            abilities: {},
            membership: {
              date: new Date()
            },
            trips: {
              purchases: [],
              confirmedTrips: [],
              refusedTrips: [],
            }
          };
          this.initialValues = [];
        }

        return this.newMember;
      }
      else {
        let foundMember = MembersCollection.findOne(this.id);

        if (foundMember && !this.initialValues) {
          this.initialValues = this.getAllFilteredProperties(foundMember);
        }

        return foundMember;
      }
    },
    confirmedTrips() {
      if (this.member && this.member.trips.confirmedTrips) {
        const ids = this.member.trips.confirmedTrips.map(t => t.id);

        return TripsCollection.find({ _id: { $in: ids }})
          .fetch();
      }

      return [];
    },
    refusedTrips() {
      if (this.member && this.member.trips.refusedTrips) {
        const ids = this.member.trips.refusedTrips.map(t => t.id);

        return TripsCollection.find({ _id: { $in: ids }})
          .fetch();
      }

      return [];
    }
  }
}
</script>