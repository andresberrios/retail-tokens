import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import BlockchainClient from "./services/client";
declare module "vue/types/vue" {
  interface Vue {
    $client: BlockchainClient;
  }
  interface VueConstructor {
    $client: BlockchainClient;
  }
}
Vue.$client = Vue.prototype.$client = new BlockchainClient();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
