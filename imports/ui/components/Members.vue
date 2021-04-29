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
      <v-data-table
        :headers="headers"
        :items="members"
        :disablePagination="true"
        :hide-default-footer="true"
        :item-class="i => 'memberRow'"
        @click:row="itemClick"
        class="elevation-2"
      >

        <template v-slot:item.membership="{item}">
          <template v-if="item.infos.lastname==='Dupuis'">
            <v-icon color="green darken-2">mdi-checkbox-marked-circle</v-icon>
          </template>
          <template v-else>
            <v-icon color="red darken-2">mdi-alert-circle</v-icon>
          </template>
        </template>
      </v-data-table>
    </v-row>
    <v-row>
      <div class="paginationContainer">
        <v-pagination
          v-model="currentPage"
          :length="nbPages"
          circle
        />
      </div>
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

export default {
  components: {
    FullPageLayout
  },
  data() {
    return {
      currentPage: 1,
      nbPages: 14,
      search: '',
      headers: [
        { text: 'Nom', value: 'infos.lastname' },
        { text: 'Prénom', value: 'infos.firstname' },
        { text: 'Email', value: 'infos.email' },
        { text: 'Sorties', value: 'infos.email' },
        { text: 'Refus', value: 'infos.email' },
        { text: 'Date d\'adhésion', value: 'membership' },
      ]
    };
  },
  methods: {
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