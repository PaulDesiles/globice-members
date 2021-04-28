import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './components/Home.vue';
import Members from './components/Members.vue';
import Trips from './components/Trips.vue';

const routes = [
  {
    path: "/",
    name: 'Home',
    component: Home
  },
  {
    path: "/members",
    name: 'Members',
    component: Members
  },
  {
    path: "/trips",
    name: 'Trips',
    component: Trips
  }
];

const router = new VueRouter({
  routes
});

export default router;
