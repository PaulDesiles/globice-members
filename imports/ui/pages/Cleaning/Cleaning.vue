<template>
  <FullPageLayout 
    ref="layout"
    title="Nettoyage de données"
    backLabel="retour à l'accueil"
    backTarget="/"
    :loading="!$subReady.members || !$subReady.trips || !$subReady.parsedhelloasso"
  >
    <template>
      <div>
        <h3>HelloAsso</h3>
        <p>
          Date maximale pour les entrées HelloAsso: <b>{{ helloAssoCleanDate }}</b>
          <br />Entrées HelloAsso en attente de suppression: <b>{{ parsedHelloAssoToCleanCount }}</b>
        </p>
        <v-btn
          :loading="cleaningHelloAsso"
          @click="cleanHelloAsso()"
        >
          Supprimer ces anciennes données
        </v-btn>

        <h3 class="mt-12">Membres</h3>
        <p>
          Date maximale pour les adhésions : <b>{{ membershipCleanDate }}</b>
          <br />
          Membres en attente de suppression : <b>{{ membersToClean.length }}</b>
          <span class="total"> / {{ allMembersCount }}</span>
          <br />
        </p>
        <v-btn @click="showMembersList = true">
          Afficher la liste
        </v-btn>
        <v-btn @click="cleanMembers()">
          Supprimer ces anciens membres
        </v-btn>

        <h3 class="mt-12">Sorties</h3>
        <p>
          Date maximale pour les sorties : <b>{{ membershipCleanDate }}</b>
          <br />
          Sorties en attente d'anonymisation : <b>{{ tripsToClean.length }}</b>
          <span class="total"> / {{  allTripsCount }}</span>
        </p>
        <v-btn @click="cleanTrips()">
          Anonymiser ces anciennes sorties
        </v-btn>

        <v-dialog v-model="showMembersList" max-width="800">
          <v-card>
            <v-card-text class="pt-2">
              <v-table
                class="mt-2"
                height="300px"
                fixed-header>
                <thead>
                  <tr>
                    <th class="text-left">Prénom</th>
                    <th class="text-left">Nom</th>
                    <th class="text-left">Date d'adhésion</th>
                    <th class="text-left">Anciennes adhésions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in membersToClean"
                    :key="member.Id"
                  >
                    <td>
                      {{ member.infos.firstname }}
                    </td>
                    <td>
                      {{ member.infos.lastname }}
                    </td>
                    <td>
                      {{ member.membership.date.toLocaleDateString() }}
                    </td>
                    <td>
                      <span v-for="membership in member.membership.previousMemberships">
                        {{ membership.toLocaleDateString() }}, 
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>

          
        </v-dialog>
      </div>
    </template>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from '../../components/FullPageLayout.vue';
import { Meteor } from 'meteor/meteor';

import { ParsedHelloAssoCollection } from "../../../db/ParsedHelloAssoCollection";
import { MembersCollection } from "../../../db/MembersCollection";
import { TripsCollection } from "../../../db/TripsCollection";

import { getHelloAssoCleanDate, getLastMembershipCampaignEndDate } from "../../../commonHelpers/cleaningHelper";

export default {
  components: {
    FullPageLayout,
  },
  data: () => ({
    cleaningHelloAsso: false,
    cleaningMembers: false,
    cleaningTrips: false,
    showMembersList: false
  }),
  computed: {
    helloAssoCleanDate() {
      return getHelloAssoCleanDate().toLocaleDateString();
    },
    membershipCleanDate() {
      return getLastMembershipCampaignEndDate().toLocaleDateString();
    }
  },
  methods: {
    cleanHelloAsso() {
      this.cleaningHelloAsso = true;
      const clean = () => {
        Meteor.call(
          'parsedhelloasso.cleanup',
          getHelloAssoCleanDate(),
          (error, result) => {
            this.cleaningHelloAsso = false;

            if (error) {
              console.log(error);
            }
        });
      
      }
      setTimeout(clean, 1000);
    },
    cleanMembers() {
      this.cleaningMembers = true;
      const clean = () => {
        Meteor.call(
          'members.cleanup',
          getHelloAssoCleanDate(),
          (error, result) => {
            this.cleaningMembers = false;

            if (error) {
              console.log(error);
            }
        });
      
      }
      setTimeout(clean, 1000);
    },
    cleanTrips() {
      this.cleaningTrips = true;
      const clean = () => {
        Meteor.call(
          'trips.cleanApplicants',
          getHelloAssoCleanDate(),
          (error, result) => {
            this.cleaningTrips = false;

            if (error) {
              console.log(error);
            }
        });
      
      }
      setTimeout(clean, 1000);
    },
  },
  meteor: {
    $subscribe: {
      'parsedhelloasso': [],
      'members': [],
      'trips': [],
    },
    parsedHelloAssoToCleanCount() {
      const maxDate = getHelloAssoCleanDate();
      return ParsedHelloAssoCollection.find({
        $and: [
        { resolved: true },
        { date: { $lt: maxDate.toISOString() } }
      ]
      }).fetch().length;
    },

    allMembersCount() {
      return MembersCollection.find({ }).fetch().length;
    },
    membersToClean() {
      const maxDate = getLastMembershipCampaignEndDate();
      return MembersCollection.find({ 
        'membership.date': { $lt: maxDate }
      }).fetch();
    },

    allTripsCount() {
      return TripsCollection.find({ }).fetch().length;
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

<style scoped>
  .total {
    opacity: 0.5;
  }

  thead {
    position: sticky;
    top: 0;
    background: white;
  }

  th {
    padding-right: 2rem;
    padding-bottom: 5px;
  }
</style>