<template>
  <CardLayout title="Accueil" large>
    <div class="split-row">
      <MainButton target="members" label="Bénévoles" />
      <MainButton target="trips" label="Sorties" />
      <MainButton :target="resourcesTarget" image="resources" label="Ressources" external />
    </div>
    <template slot="below">
      <div class="d-flex justify-end">
          <v-btn
            plain
            @click="$router.push('/parameters')"
          >
            <v-icon left>mdi-wrench-outline</v-icon>
            Paramètres
          </v-btn>
      </div>
    </template>
  </CardLayout>
</template>

<script>
import CardLayout from '../../components/CardLayout.vue';
import MainButton from './MainButton.vue';

import { Meteor } from 'meteor/meteor';
import { ParametersCollection } from "../../../db/ParametersCollection";

export default {
  components: {
    CardLayout,
    MainButton
  },
  computed: {
    resourcesTarget() {
      if (this.$subReady.parameters) {
        return this.parameters.resourcesLink;
      }

      return '/';
    }
  },
  meteor: {
    $subscribe: {
      'parameters': [],
    },
    parameters() {
      return ParametersCollection.findOne({});
    },
  }
}
</script>

<style>
  .split-row {
    height: 100%;
    display: grid;
    grid-template-columns: auto auto auto;
    align-content: center;
    justify-content: space-evenly;
  }
</style>