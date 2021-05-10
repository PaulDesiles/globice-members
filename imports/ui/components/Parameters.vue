<template>
  <FullPageLayout
    ref="layout"
    title="Paramètres"
    backLabel="retour à la l'accueil"
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

        <h3>Bénévoles</h3>
        <div class="d-flex flex-wrap">
          <ChoicesEditor title="Permis bateau" v-model="parameters.member.boatLicense" />
          <ChoicesEditor title="Volonté d'être capitaine" v-model="parameters.member.captain" />
          <ChoicesEditor title="Compétences plongée" v-model="parameters.member.diving" />
          <ChoicesEditor title="Compétences photo" v-model="parameters.member.photo" />
          <ChoicesEditor title="Primo-adhérent" v-model="parameters.member.newMember" />
          <ChoicesEditor
            title="Taille des carnets de sorties"
            v-model="parameters.member.bookSizeChoices"
            integerValues
            :labelGetter="(x) => `${x} sorties`"
          />
        </div>
        
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
import FullPageLayout from './FullPageLayout.vue';
import ChoicesEditor from './ChoicesEditor.vue';

import { Meteor } from 'meteor/meteor';
import { ParametersCollection } from "../../db/ParametersCollection";

export default {
  components: {
    FullPageLayout,
    ChoicesEditor
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