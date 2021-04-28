<template>
  <div class="app">
    <template v-if="currentUser">
      <router-view></router-view>
    </template>

    <template v-else>
      <Login />
    </template>
  </div>
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
  meteor: {
    currentUser() {
      return Meteor.user();
    }
  }
};
</script>

<style>
  .app {
    font-family: Arial, Helvetica, sans-serif;
    background: #eee;
  }
</style>
