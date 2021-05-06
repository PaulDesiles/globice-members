<template>
  <FullPageLayout 
    title="Bénévoles"
    backLabel="retour à l'accueil"
    backTarget="/">
    <template v-slot:header-right>
      <v-btn
        color="primary"
        elevation="5"
        rounded
        @click="createMember"
      >
        <v-icon left>mdi-account-plus</v-icon>
        ajouter un bénévole
      </v-btn>
    </template>

    <v-row>
      <v-col :cols="4" class="pt-0 pb-2">
        <v-text-field
          v-model="search"
          label="rechercher un bénévole"
          prepend-inner-icon="mdi-magnify"
          hide-details="auto"
          outlined
          dense
          flat
          solo
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
          <v-data-table
            :headers="headers"
            :items="members"
            :disablePagination="true"
            :hide-default-footer="true"
            :must-sort="true"
            :options="{ sortBy: ['infos.lastname'] }"
            :item-class="i => 'memberRow'"
            :loading="!$subReady.members"
            loading-text="chargement..."
            @click:row="itemClick"
            class="elevation-3"
          >

            <template v-slot:[`item.trips.acceptedSumUp`]="{item}">
              <span>0/0</span>
            </template>

            <template v-slot:[`item.trips.refusedSumUp`]="{item}">
              <span>0</span>
            </template>

            <template v-slot:[`item.membership.date`]="{item}">
              <span>{{ formatDate(item.membership.date) }}</span>

              <template v-if="membershipUpToDate(item.membership.date)">
                <v-icon color="green darken-2">mdi-checkbox-marked-circle</v-icon>
              </template>
              <template v-else>
                <v-icon color="red darken-2">mdi-alert-circle</v-icon>
              </template>
            </template>
          </v-data-table>
      </v-col>
    </v-row>

  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";
import { sortDates, formatDate } from '../helpers/dateHelper';
import { getMemberSearchQuery } from '../helpers/mongoHelper';

const pivotMembershipDate = Date.UTC(new Date().getUTCFullYear() - 1, 4, 1,0, 0, 0);

export default {
  components: {
    FullPageLayout
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Nom', value: 'infos.lastname', width: '17%' },
        { text: 'Prénom', value: 'infos.firstname', width: '17%' },
        { text: 'Email', value: 'infos.email', width: '31%' },
        { text: 'Sorties', value: 'trips.acceptedSumUp', width: '10%' },
        { text: 'Refus', value: 'trips.refusedSumUp', width: '10%' },
        { text: 'Date d\'adhésion', value: 'membership.date', width: '15%', sort: sortDates },
      ]
    };
  },
  methods: {
    formatDate,
    membershipUpToDate(date) {
      return date > pivotMembershipDate;
    },
    itemClick(item) {
      this.$router.push({ path: `/member/${item._id}` });
    },
    createMember() {
      this.$router.push({ path: `/member/new` });
    }
  },
  meteor: {
    $subscribe: {
      'members': []
    },
    members() {
      const query = getMemberSearchQuery(this.search);
      return MembersCollection.find(query).fetch();
    }
  }
};
</script>

<style>
  .v-data-table {
    overflow: hidden; /* to crop header background with a correct border-radius */
    
  }
  .v-data-table-header {
    background: #efefef;
  }

  table {
    table-layout : fixed;
  }

  .v-data-table-header th span {
    color: var(--blue);
  }

  tr.memberRow {
    cursor: pointer;
  }

  .paginationContainer {
    max-width: 400px;
  }
</style>