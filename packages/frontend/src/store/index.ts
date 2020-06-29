import Vue from "vue";
import Vuex from "vuex";
import { connectScatter } from "./scatter";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: null,
    allTokens: null
  },
  getters: {
    loggedIn(state) {
      return state.account !== null;
    }
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setAllTokens(state, tokens) {
      state.allTokens = tokens;
    }
  },
  actions: {
    async pairScatter({ commit }) {
      const { account, eos } = await connectScatter();
      Vue.$client.setEos(eos);
      commit("setAccount", account);
    },
    logOut({ commit }) {
      Vue.$client.unsetEos();
      commit("setAccount", null);
    },
    async loadAllTokens({ commit }) {
      commit("setAllTokens", await Vue.$client.getAllTokens());
    }
  }
});
