import Vue from 'vue';
import '../imports/plugins';
import App from '../imports/ui/App.vue';

import router from '../imports/ui/routes.js'

Meteor.startup(() => {
  new Vue({
    router,
    el: '#app',
    ...App,
  })
});
