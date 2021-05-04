import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './components/Home.vue';
import Members from './components/Members.vue';
import Member from './components/Member.vue';
import Trips from './components/Trips.vue';
import Trip from './components/Trip.vue';

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
  }
];

const router = new VueRouter({
  routes
});

export default router;
