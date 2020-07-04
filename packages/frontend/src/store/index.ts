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
  allTokensLoaded: boolean | null;
}>({
  state: {
    account: null,
    allTokens: null,
    allTokensLoaded: null
  },
  getters: {
    loggedIn(state) {
      return state.account !== null;
    },
    getIssuedTokens: state => (account: string) => {
      return state.allTokens?.filter(t => t.issuer === account) || [];
    }
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setAllTokens(state, tokens) {
      state.allTokens = tokens;
    },
    setLoading(state, loaded) {
      state.allTokensLoaded = loaded;
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
    async logOut({ commit }) {
      await Vue.$client.session?.remove();
      delete Vue.$client.session;
      commit("setAccount", null);
    },
    async loadAllTokens({ commit }) {
      let loaded = false;
      const results = await Vue.$client.getAllTokenStats();
      await results.fetchRest();
      loaded = true;
      commit("setAllTokens", results.rows);
      commit("setLoading", loaded);
    }
  }
});
