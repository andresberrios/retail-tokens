import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
// import "bootstrap/dist/css/bootstrap.css";
import "./style/index.scss";
// import "bootstrap-vue/dist/bootstrap-vue.css";

import BlockchainClient from "./services/client";
declare module "vue/types/vue" {
  interface Vue {
    $client: BlockchainClient;
  }
  interface VueConstructor {
    $client: BlockchainClient;
  }
}
const endpoint = process.env.VUE_APP_CHAIN_NODE;
const contract = process.env.VUE_APP_CONTRACT_ACCOUNT;
const backend = process.env.VUE_APP_BACKEND_URL;
if (!endpoint || !contract || !backend) {
  throw new Error("Missing required environment variables");
}
Vue.$client = Vue.prototype.$client = new BlockchainClient(
  endpoint,
  contract,
  backend
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
