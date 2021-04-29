<template>
  <FullPageLayout 
    title="Bénévoles"
    backLabel="retour à l'accueil"
    backTarget="/">
    <template v-slot:header-right>
      <v-text-field
        v-model="search"
        label="rechercher"
        prepend-inner-icon="mdi-magnify"
        hide-details="auto"
        light
        solo
        clearable
      />
    </template>


    <v-row>
      <v-layout child-flex>
        <v-data-table
          :headers="headers"
          :items="members"
          :disablePagination="true"
          :hide-default-footer="true"
          :item-class="i => 'memberRow'"
          @click:row="itemClick"
          class="elevation-2 mt-5"
        >

          <template v-slot:item.trips.acceptedSumUp="{item}">
            <span>0/0</span>
          </template>

          <template v-slot:item.trips.refusedSumUp="{item}">
            <span>0</span>
          </template>

          <template v-slot:item.membership.date="{item}">
            <span>{{ formatDate(item.membership.date) }}</span>

            <template v-if="membershipUpToDate(item.membership.date)">
              <v-icon color="green darken-2">mdi-checkbox-marked-circle</v-icon>
            </template>
            <template v-else>
              <v-icon color="red darken-2">mdi-alert-circle</v-icon>
            </template>
          </template>
        </v-data-table>
      </v-layout>
    </v-row>

  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";

const searchFor = (propertyName, searchTerm) => ({
  [`infos.${propertyName}`] : { $regex: searchTerm, $options: "i" }
});

const pivotMembershipDate = Date.UTC(new Date().getUTCFullYear() - 1, 4, 1,0, 0, 0);

export default {
  components: {
    FullPageLayout
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Nom', value: 'infos.lastname' },
        { text: 'Prénom', value: 'infos.firstname' },
        { text: 'Email', value: 'infos.email' },
        { text: 'Sorties', value: 'trips.acceptedSumUp' },
        { text: 'Refus', value: 'trips.refusedSumUp' },
        { text: 'Date d\'adhésion', value: 'membership.date' },
      ]
    };
  },
  methods: {
    membershipUpToDate(date) {
      return date > pivotMembershipDate;
    },
    formatDate(d) {
      return d.toLocaleDateString(
        'fr-FR', 
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      );
    },
    itemClick(item) {
      this.$router.push({ path: `/member/${item._id}` });
    }
  },
  meteor: {
    $subscribe: {
      'members': []
    },
    members() {
      let query = { };

      if (this.search) {
        if (this.search.includes('@')) {
          query = searchFor("email", this.search);
        } else {
          query = { 
            $or: ["lastname", "firstname", "email"]
              .map(p => searchFor(p, this.search))
          };
        }
      }

      return MembersCollection.find(query).fetch();
    }
  }
};
</script>

<style>
  tr.memberRow {
    cursor: pointer;
  }

  .paginationContainer {
    max-width: 400px;
  }
</style>