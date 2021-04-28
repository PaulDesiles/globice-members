<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <v-main>
        <template v-if="currentUser">
          <router-view></router-view>
        </template>

        <template v-else>
          <Login />
        </template>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
import { Meteor } from 'meteor/meteor';
import Login from "./components/Login.vue";

export default {
  components: {
    Login,
  },
  methods: {
  },
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },
  meteor: {
    currentUser() {
      return Meteor.user();
    }
  }
};
</script>

<style>
</style>
