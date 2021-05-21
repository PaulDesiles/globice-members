<template>
  <FullPageLayout
    ref="layout"
    title="Paramètres"
    backLabel="retour à l'accueil"
    backTarget="/"
    :hasUnsavedChanges="hasUnsavedChanges"
    :loading="!$subReady.parameters"
  >
    <template v-if="parameters" >

      <v-form @submit.prevent="handleSubmit">
        <h3>Sorties</h3>
        <div class="d-flex flex-wrap">
          <ChoicesEditor title="Capitaines" v-model="parameters.trip.captain" />
          <ChoicesEditor title="Type de sortie" v-model="parameters.trip.type" />
          <ChoicesEditor title="Port de départ" v-model="parameters.trip.port" />
          <ChoicesEditor title="Loueur du bateau" v-model="parameters.trip.renter" />
          <ChoicesEditor title="Rôles des bénévoles" v-model="parameters.trip.roles" />
        </div>

        <v-textarea
          class="mt-4"
          outlined
          label="Mail de contact type"
          v-model="parameters.trip.mailBody"
        />


        <h3>Bénévoles</h3>
        <div class="d-flex flex-wrap">
          <ChoicesEditor title="Permis bateau" v-model="parameters.member.boatLicense" />
          <ChoicesEditor title="Volonté d'être capitaine" v-model="parameters.member.captain" />
          <ChoicesEditor title="Compétences plongée" v-model="parameters.member.diving" />
          <ChoicesEditor title="Compétences photo" v-model="parameters.member.photo" />
          <ChoicesEditor title="Couleurs des compétences photo" v-model="parameters.member.photoColors" />
          <ChoicesEditor title="Primo-adhérent" v-model="parameters.member.newMember" />
          <ChoicesEditor
            title="Taille des carnets de sorties"
            v-model="parameters.member.bookSizeChoices"
            integerValues
            :labelGetter="(x) => `${x} sorties`"
          />
        </div>

        <h3>Nouveaux Bénévoles via HelloAsso</h3>
        <p>Textes des questions du formulaire d'adhésion HelloAsso, pour ajouter automatiquement les bénévoles à partir des réponses</p>
        
        <v-text-field 
          outlined
          label="Date de naisance"
          v-model="parameters.newMemberForm.birthdate"
        />
        <v-text-field 
          outlined
          label="Email"
          v-model="parameters.newMemberForm.email"
        />
        <v-text-field 
          outlined
          label="Téléphone"
          v-model="parameters.newMemberForm.phone"
        />
        <v-text-field 
          outlined
          label="Adresse"
          v-model="parameters.newMemberForm.address"
        />
        <v-text-field 
          outlined
          label="Code postal"
          v-model="parameters.newMemberForm.postCode"
        />
        <v-text-field 
          outlined
          label="Ville"
          v-model="parameters.newMemberForm.city"
        />
        <v-text-field 
          outlined
          label="Permis bateau"
          v-model="parameters.newMemberForm.boatLicense"
        />
        <v-text-field 
          outlined
          label="Capitaine"
          v-model="parameters.newMemberForm.captain"
        />
        <v-text-field 
          outlined
          label="Plongée"
          v-model="parameters.newMemberForm.diving"
        />
        <v-text-field 
          outlined
          label="Photo"
          v-model="parameters.newMemberForm.photo"
        />
        <v-text-field 
          outlined
          label="PrimoAdhésion"
          v-model="parameters.newMemberForm.isNewMember"
        />
        
        <div class="d-flex justify-end">
          <v-btn
            type="submit"
            color="primary"
            elevation="7"
            :loading="saving"
            :disabled="saving"
            rounded
            large
          >
            enregistrer les modifications
          </v-btn>
        </div>
      </v-form>
    </template>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from '../../components/FullPageLayout.vue';
import ChoicesEditor from './ChoicesEditor.vue';

import { Meteor } from 'meteor/meteor';
import { ParametersCollection } from "../../../db/ParametersCollection";

export default {
  components: {
    FullPageLayout,
    ChoicesEditor,
  },
  data() {
    return {
      saving: false,
    }
  },
  computed: {
    hasUnsavedChanges() {
      return false;
    }
  },
  methods: {
    handleSubmit(event) {
      this.saving = true;

      Meteor.call('parameters.update', this.parameters._id, this.parameters, (error, result) => {
        this.$refs.layout.onSaveEnd(error, false);
        setTimeout(() => this.saving = false, 500); // extra delay
      });
    },
  },
  meteor: {
    $subscribe: {
      'parameters': [],
    },
    parameters() {
      return ParametersCollection.findOne({});
    }
  }
};
</script>ChoicesEditor