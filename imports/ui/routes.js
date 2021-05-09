import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './components/Home.vue';
import Members from './components/Members.vue';
import Member from './components/Member.vue';
import Trips from './components/Trips.vue';
import Trip from './components/Trip.vue';
import Parameters from './components/Parameters.vue';

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
    path: "/member/:id",
    name: 'Member',
    component: Member,
    props: true
  },
  {
    path: "/trips",
    name: 'Trips',
    component: Trips
  },
  {
    path: "/trip/:id",
    name: 'Trip',
    component: Trip,
    props: true
  },
  {
    path: "/parameters",
    name: 'Parameters',
    component: Parameters
  }
];

const router = new VueRouter({
  routes
});

export default router;
