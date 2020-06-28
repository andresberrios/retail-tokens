import Vue from "vue";
import Vuex from "vuex";
import { connectScatter } from "./scatter";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: null
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    }
  },
  actions: {
    async pairScatter({ commit, dispatch }) {
      const { account, eos } = await connectScatter();
      Vue.$client.eos = eos;
      commit("setAccount", account);
      dispatch("loadAccountType");
    },
    async loadAccountType() {
      // Implement it
    }
  }
});
