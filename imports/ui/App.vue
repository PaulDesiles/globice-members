<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <v-main>
        <template v-if="currentUser">
          <transition :name="transitionName" mode="out-in">
            <router-view></router-view>
          </transition>
        </template>

        <template v-else>
          <transition appear name="fade">
            <Login />
          </transition>
        </template>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
import { Meteor } from 'meteor/meteor';
import Login from "./pages/Login/Login.vue";

export default {
  components: {
    Login,
  },
  data() {
    return {
      transitionName: 'fade'
    };
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').filter(x => x).length;
      const fromDepth = from.path.split('/').filter(x => x).length;

      if (toDepth < fromDepth) {
        this.transitionName = 'slide-right';
      } else if (toDepth === fromDepth) {
        this.transitionName = 'fade';
      } else {
        this.transitionName = 'slide-left';
      }
    }
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }


  .slide-right-enter-active, .slide-right-leave-active {
    transition: transform .3s, opacity .3s;
  }
  .slide-right-enter {
    transform: translate(-100%, 0);
    opacity: 0;
  }
  .slide-right-leave-to {
    transform: translate(100%, 0);
    opacity: 0;
  }


  .slide-left-enter-active, .slide-left-leave-active {
    transition: transform .3s, opacity .3s;
  }
  .slide-left-enter {
    transform: translate(100%, 0);
    opacity: 0;
  }
  .slide-left-leave-to {
    transform: translate(-100%, 0);
    opacity: 0;
  }
</style>
