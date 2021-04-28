import Vue from 'vue';
import '../imports/plugins';
import App from '../imports/ui/App.vue';

import router from '../imports/ui/routes.js';
import vuetify from '../imports/plugins/vuetify.js';

Meteor.startup(() => {
  new Vue({
    router,
    vuetify,
    el: '#app',
    ...App,
  })
});
