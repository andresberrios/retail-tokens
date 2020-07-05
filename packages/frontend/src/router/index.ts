import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import AccountView from "../views/AccountView.vue";
import TokenView from "../views/TokenView.vue";
import Register from "../views/Register.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    meta: { title: "Home" },
    component: Home
  },
  {
    path: "/account/:account",
    name: "account",
    meta: { title: "Account" },
    props: true,
    component: AccountView
  },
  {
    path: "/token/:token",
    name: "token",
    meta: { title: "Token" },
    props: true,
    component: TokenView
  },
  {
    path: "/token/:token/register",
    name: "register",
    meta: { title: "Register" },
    props: true,
    component: Register
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.afterEach(to => {
  Vue.nextTick(() => {
    document.title =
      to.meta.title || to.name || process.env.VUE_APP_NAME || "frontend";
  });
});

export default router;
