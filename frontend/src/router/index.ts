import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import RetailerView from "../views/RetailerView.vue";
import UserView from "../views/UserView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/retailer/:id",
    name: "retailer",
    meta: { title: "Retailer" },
    component: RetailerView
  },
  {
    path: "/user/:id",
    name: "user",
    meta: { title: "User" },
    component: UserView
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
