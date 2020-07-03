import Vue from "vue";
import Vuex from "vuex";
import { connectAnchor, restoreAnchorSession } from "./anchor";
import { TokenStats } from "../services/client";

Vue.use(Vuex);

export default new Vuex.Store<{
  account: {
    actor: string;
    permission: string;
  } | null;
  allTokens: TokenStats[] | null;
}>({
  state: {
    account: null,
    allTokens: null
  },
  getters: {
    loggedIn(state) {
      return state.account !== null;
    },
    getIssuedToken: state => (account: string) => {
      return state.allTokens?.find(t => t.issuer === account);
    },
    accountIsRetailer: (state, getters) => (account: string) => {
      return !!getters.getIssuedToken(account);
    },
    currentAccountIsRetailer(state, getters) {
      return getters.accountIsRetailer(state.account?.actor);
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
    async logIn({ commit }) {
      const result = await connectAnchor();
      Vue.$client.session = result.session;
      commit("setAccount", result.session.auth);
    },
    async restoreSession({ commit }) {
      const session = await restoreAnchorSession();
      if (session) {
        Vue.$client.session = session;
        commit("setAccount", session.auth);
      }
    },
    logOut({ commit }) {
      Vue.$client.session?.remove();
      delete Vue.$client.session;
      commit("setAccount", null);
    },
    async loadAllTokens({ commit }) {
      const results = await Vue.$client.getAllTokenStats();
      await results.fetchRest();
      commit("setAllTokens", results.rows);
    }
  }
});
