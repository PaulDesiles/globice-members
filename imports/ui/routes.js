import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './pages/Home/Home.vue';
import Members from './pages/Members/Members.vue';
import Member from './pages/Member/Member.vue';
import ApiDashboard from './pages/ApiDashboard/ApiDashboard.vue';
import Trips from './pages/Trips/Trips.vue';
import Trip from './pages/Trip/Trip.vue';
import Parameters from './pages/Parameters/Parameters.vue';

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
    path: "/apidashboard",
    name: 'ApiDashboard',
    component: ApiDashboard
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
