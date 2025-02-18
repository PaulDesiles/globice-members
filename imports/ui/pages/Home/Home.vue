<template>
  <CardLayout title="Globice Crew" showBackground large>
    <div class="split-row">
      <MainButton target="members" label="Bénévoles" />
      <MainButton target="trips" label="Sorties" />
      <MainButton :target="resourcesTarget" image="resources" label="Ressources" external />
    </div>
    <template slot="below">
      <a id="disconnect-button" @click="disconnect">déconnexion</a>
      
      <div class="d-flex justify-space-between">
        <v-btn
          plain
          @click="$router.push('/cleaning')"
        >
          <v-icon left>mdi-broom</v-icon>
          Nettoyage
        </v-btn>
        <v-btn
          plain
          @click="$router.push('/parameters')"
        >
          <v-icon left>mdi-wrench-outline</v-icon>
          Paramètres
        </v-btn>
      </div>

      <span v-if="!$subReady.members || !$subReady.trips" class="cleaning-info">chargement...</span>
      <ul v-else class="cleaning-info">
        <li>Date pivot pour les adhésions : {{ pivotDate }}</li>
        <li>Membres en attente de suppression : {{ membersToClean.length }}</li>
        <li>Sorties en attente d'anonymisation : {{ tripsToClean.length }}</li>
      </ul>
    </template>
  </CardLayout>
</template>

<script>
import CardLayout from '../../components/CardLayout.vue';
import MainButton from './MainButton.vue';

import { Meteor } from 'meteor/meteor';
import { ParametersCollection } from "../../../db/ParametersCollection";
import { MembersCollection } from "../../../db/MembersCollection";
import { TripsCollection } from "../../../db/TripsCollection";
import { getLastMembershipCampaignEndDate } from "../../../commonHelpers/cleaningHelper";

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
    },
    pivotDate() {
      return getLastMembershipCampaignEndDate().toLocaleDateString();
    }
  },
  methods: {
    disconnect() {
      Meteor.logout();
    }
  },
  // mounted: function () {
  //   Meteor.call('cleaning.clean');
  // },
  meteor: {
    $subscribe: {
      'parameters': [],
      'members': [],
      'trips': [],
    },
    parameters() {
      return ParametersCollection.findOne({});
    },
    membersToClean() {
      const maxDate = getLastMembershipCampaignEndDate();
      return MembersCollection.find({ 
        'membership.date': { $lt: maxDate }
      }).fetch();
    },
    tripsToClean() {
      const maxDate = getLastMembershipCampaignEndDate();
      return TripsCollection.find({
        $and: [
          { _anonymized: null },
          { date: { $lt: maxDate } }
        ]
      }).fetch();
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

  #disconnect-button {
    position: fixed;
    bottom: 10px;
    left: 10px;
    color: var(--dark-blue);
  }

  .cleaning-info {
    color: black;
  }
</style>